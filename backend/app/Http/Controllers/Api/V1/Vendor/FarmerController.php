use App\Models\Item;
use App\Models\Store;
use App\Models\Vendor;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\GrowthUpdate;
use App\Models\CustomerProductSubscription;
use Illuminate\Http\Request;
use App\CentralLogics\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Traits\SmsGateway;

class FarmerController extends Controller
{
    use SmsGateway;

    /**
     * Farmer Dashboard - Overview of farming products
     */
    public function dashboard(Request $request)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        if (!$store) {
            return response()->json([
                'errors' => [['code' => 'no_store', 'message' => translate('messages.no_store_found')]]
            ], 404);
        }

        $items = Item::where('store_id', $store->id)
            ->where('is_approved', 1)
            ->where('status', 1);

        $stats = [
            'total_products' => $items->count(),
            'currently_farming' => $items->ongoingFarming()->count(),
            'harvest_ready' => $items->harvestReady()->count(),
            'backyard_farms' => $items->backyard()->count(),
            'in_stock' => $items->where('farming_status', 'in_stock')->count(),
        ];

        $farming_items = $items->ongoingFarming()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'farming_status' => $item->farming_status,
                    'is_backyard' => $item->is_backyard,
                    'price' => $item->price,
                    'unit' => $item->unit,
                    'image_full_url' => $item->image_full_url,
                    'scheduled_at' => $item->planting_date,
                    'harvest_date' => $item->expected_harvest_date,
                    'crop_cycle_days' => $item->crop_cycle_days,
                    'days_to_harvest' => $item->expected_harvest_date
                        ? \Carbon\Carbon::parse($item->expected_harvest_date)->diffInDays(\Carbon\Carbon::now())
                        : null,
                    'status_label' => ucfirst($item->farming_status),
                ];
            });

        return response()->json([
            'stats' => $stats,
            'farming_items' => $farming_items,
        ], 200);
    }

    /**
     * List farmer's products with farming filters
     */
    public function products(Request $request)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        if (!$store) {
            return response()->json([
                'errors' => [['code' => 'no_store', 'message' => translate('messages.no_store_found')]]
            ], 404);
        }

        $farming_status = $request->query('farming_status', 'all'); // farming, harvest_ready, in_stock, all
        $is_backyard = $request->query('is_backyard', 'all');
        $search = $request->query('search', null);
        $limit = $request->query('limit', 25);
        $offset = $request->query('offset', 1);

        $query = Item::where('store_id', $store->id)
            ->where('is_approved', 1)
            ->where('status', 1);

        if ($farming_status !== 'all') {
            $query->where('farming_status', $farming_status);
        }

        if ($is_backyard !== 'all') {
            $query->where('is_backyard', $is_backyard === 'true');
        }

        if ($search) {
            $key = explode(' ', $search);
            $query->where(function ($q) use ($key) {
                foreach ($key as $value) {
                    $q->where('name', 'like', "%{$value}%");
                }
            });
        }

        $total = $query->count();
        $items = $query->orderBy('created_at', 'desc')
            ->offset(($offset - 1) * $limit)
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'description' => $item->description,
                    'price' => $item->price,
                    'unit' => $item->unit,
                    'farming_status' => $item->farming_status,
                    'is_backyard' => $item->is_backyard,
                    'planting_date' => $item->planting_date,
                    'expected_harvest_date' => $item->expected_harvest_date,
                    'crop_cycle_days' => $item->crop_cycle_days,
                    'image_full_url' => $item->image_full_url,
                    'status_label' => ucfirst($item->farming_status),
                    'days_to_harvest' => $item->expected_harvest_date
                        ? \Carbon\Carbon::parse($item->expected_harvest_date)->diffInDays(\Carbon\Carbon::now())
                        : null,
                ];
            });

        return response()->json([
            'items' => $items,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ], 200);
    }

    /**
     * Update farming status of a product
     * When status changes to harvest_ready, transition pre_order orders to ready_for_fulfillment
     * and send SMS notifications to customers
     */
    public function update_farming_status(Request $request, $id)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        $validator = Validator::make($request->all(), [
            'farming_status' => 'required|in:farming,harvest_ready,in_stock',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $item = Item::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$item) {
            return response()->json([
                'errors' => [['code' => 'item_not_found', 'message' => translate('messages.item_not_found')]]
            ], 404);
        }

        $old_status = $item->farming_status;
        $item->farming_status = $request->farming_status;
        $item->save();

        // When item becomes harvest_ready, transition all pre_order orders
        // and send SMS notifications to customers
        if ($old_status !== 'harvest_ready' && $request->farming_status === 'harvest_ready') {
            $this->transitionPreOrderOrders($item, $store, $vendor);
        }

        return response()->json([
            'message' => translate('messages.farming_status_updated'),
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'farming_status' => $item->farming_status,
                'status_label' => ucfirst($item->farming_status),
            ],
        ], 200);
    }

    /**
     * Transition pre_order orders to ready_for_fulfillment when item is harvest ready
     * and send SMS notifications to customers
     */
    protected function transitionPreOrderOrders($item, $store, $vendor)
    {
        $preOrderOrders = Order::where('store_id', $store->id)
            ->where('is_pre_order', true)
            ->where('order_status', 'pre_order')
            ->get();

        $transitionedCount = 0;

        foreach ($preOrderOrders as $order) {
            // Check if this order has this specific item
            $hasItem = $order->details()->where('item_id', $item->id)->exists();

            if ($hasItem) {
                $order->order_status = 'ready_for_fulfillment';
                $order->save();

                // Send SMS notification to customer
                $this->sendHarvestReadySms($order, $item, $store);

                $transitionedCount++;
            }
        }

        return $transitionedCount;
    }

    /**
     * Send SMS notification to customer when their pre-ordered item is harvest ready
     */
    protected function sendHarvestReadySms($order, $item, $store)
    {
        // Get customer phone number
        $phone = null;
        $customerName = 'Customer';

        if ($order->user_id) {
            $user = \App\Models\User::find($order->user_id);
            if ($user) {
                $phone = $user->phone;
                $customerName = $user->f_name ?: $user->name ?: 'Customer';
            }
        } elseif ($order->is_guest && isset($order->delivery_address)) {
            $deliveryAddress = is_string($order->delivery_address)
                ? json_decode($order->delivery_address, true)
                : $order->delivery_address;
            if (is_array($deliveryAddress) && isset($deliveryAddress['contact_person_number'])) {
                $phone = $deliveryAddress['contact_person_number'];
                $customerName = $deliveryAddress['contact_person_name'] ?? 'Customer';
            }
        }

        if (!$phone) {
            return;
        }

        $message = sprintf(
            "🌾 Great news from %s! Your %s is now harvest-ready! Order #%d is being prepared. Thank you for farming with us!",
            $store->name,
            $item->name,
            $order->id
        );

        self::intekhost($phone, $message);
    }

    /**
     * Update planting and harvest dates
     */
    public function update_dates(Request $request, $id)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        $validator = Validator::make($request->all(), [
            'planting_date' => 'nullable|date',
            'expected_harvest_date' => 'nullable|date|after_or_equal:planting_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $item = Item::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$item) {
            return response()->json([
                'errors' => [['code' => 'item_not_found', 'message' => translate('messages.item_not_found')]]
            ], 404);
        }

        if ($request->has('planting_date')) {
            $item->planting_date = $request->planting_date;
        }

        if ($request->has('expected_harvest_date')) {
            $item->expected_harvest_date = $request->expected_harvest_date;
        }

        $item->save();

        return response()->json([
            'message' => translate('messages.farming_dates_updated'),
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'planting_date' => $item->planting_date,
                'expected_harvest_date' => $item->expected_harvest_date,
                'days_to_harvest' => $item->expected_harvest_date
                    ? \Carbon\Carbon::parse($item->expected_harvest_date)->diffInDays(\Carbon\Carbon::now())
                    : null,
            ],
        ], 200);
    }

    /**
     * Update growth progress for a farming product
     * Farmer can upload photos and notes about crop progress
     */
    public function update_growth(Request $request, $id)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        $validator = Validator::make($request->all(), [
            'progress_pct' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string|max:1000',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $item = Item::where('id', $id)
            ->where('store_id', $store->id)
            ->where('farming_status', 'farming')
            ->first();

        if (!$item) {
            return response()->json([
                'errors' => [['code' => 'item_not_found', 'message' => translate('messages.item_not_found')]]
            ], 404);
        }

        $growth = GrowthUpdate::create([
            'product_id' => $item->id,
            'vendor_id' => $vendor->id,
            'progress_pct' => $request->progress_pct,
            'notes' => $request->notes,
            'photos' => $request->photos ?? [],
        ]);

        // Send SMS to subscribed customers about growth update
        $subscribers = CustomerProductSubscription::forProduct($item->id)->get();
        foreach ($subscribers as $sub) {
            $message = sprintf(
                "🌱 Farm update from %s: %s is %d%% grown. Estimated harvest: %s. Stay tuned!",
                $store->name,
                $item->name,
                $request->progress_pct,
                $item->expected_harvest_date ?? 'soon'
            );
            self::intekhost($sub->phone, $message);
        }

        // Check if harvest ready and auto-update status
        if ($request->progress_pct >= 100) {
            $item->farming_status = 'harvest_ready';
            $item->save();
            $this->transitionPreOrderOrders($item, $store, $vendor);
        }

        return response()->json([
            'message' => translate('messages.growth_update_saved'),
            'growth' => [
                'id' => $growth->id,
                'product_id' => $growth->product_id,
                'progress_pct' => $growth->progress_pct,
                'notes' => $growth->notes,
                'photos' => $growth->photos,
                'created_at' => $growth->created_at,
            ],
        ], 200);
    }

    /**
     * Send SMS broadcast to all subscribers of a farming product
     */
    public function broadcast_sms(Request $request, $id)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1600',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $item = Item::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$item) {
            return response()->json([
                'errors' => [['code' => 'item_not_found', 'message' => translate('messages.item_not_found')]]
            ], 404);
        }

        $subscribers = CustomerProductSubscription::forProduct($item->id)->get();
        $sent = 0;
        $failed = 0;

        foreach ($subscribers as $sub) {
            $message = sprintf(
                "🌾 Update from %s: %s\n%s",
                $store->name,
                $item->name,
                $request->message
            );
            $result = self::intekhost($sub->phone, $message);
            if ($result === 'success') {
                $sent++;
            } else {
                $failed++;
            }
        }

        return response()->json([
            'message' => translate('messages.sms_broadcast_sent'),
            'sent' => $sent,
            'failed' => $failed,
            'total_subscribers' => $subscribers->count(),
        ], 200);
    }

    /**
     * Get subscribers for a farming product
     */
    public function get_subscribers(Request $request, $id)
    {
        $vendor = $request['vendor'];
        $store = $vendor->stores()->first();

        $item = Item::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$item) {
            return response()->json([
                'errors' => [['code' => 'item_not_found', 'message' => translate('messages.item_not_found')]]
            ], 404);
        }

        $subscribers = CustomerProductSubscription::forProduct($item->id)
            ->get()
            ->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'phone' => $sub->phone,
                    'subscribed_at' => $sub->subscribed_at,
                    'is_guest' => (bool) !$sub->user_id,
                ];
            });

        return response()->json([
            'subscribers' => $subscribers,
            'total' => $subscribers->count(),
        ], 200);
    }
}
