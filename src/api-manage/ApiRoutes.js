export const data_limit = "10";
export const config_api = "/api/v1/config";
export const subscribe_api = "/api/v1/newsletter/subscribe";
export const placeApiAutocomplete_api = "/api/v1/config/place-api-autocomplete";
export const placedetails_api = "/api/v1/config/place-api-details";
//export const distance_api = "/api/v1/config/distance";
export const geocode_api = "/api/v1/config/geocode-api";
export const zoneId_api = "/api/v1/config/get-zone-id";
export const moduleList = "/api/v1/module";
export const banners = "/api/v1/banners";
export const others_banners = "api/v1/other-banners";
export const categories_api = "/api/v1/categories";
export const campaigns_item = "/api/v1/campaigns/item";
export const popular_items = "/api/v1/items/popular";
export const common_condition_api = "api/v1/common-condition";
export const common_conditions_product_api = "api/v1/common-condition/items";
export const popular_store_api = "/api/v1/stores/popular";
export const subCategories_api = "/api/v1/categories/childes";
export const most_reviewed_items_api = "/api/v1/items/most-reviewed";
export const latest_store_api = "/api/v1/stores/latest";
export const latest_items_api = "/api/v1/items/latest";
export const more_from_store = "/api/v1/items/related-store-items";
export const new_arrivals = "/api/v1/items/new-arrival";
export const flash_sales = "/api/v1/flash-sales";
export const flash_sales_items = "api/v1/flash-sales/items";
export const parcel_category_api = "/api/v1/parcel-category";
// Zone-scoped parcel attributes. Both take `zone_id` as a query parameter —
// the `zoneid` header alone answers 422 "The zone id field is required."
export const parcel_weight_api = "/api/v1/parcel-weight";
export const parcel_dimension_api = "/api/v1/parcel-dimension";
export const parcel_video_api = "api/v1/other-banners/video-content";
export const parcel_whyChoose_api = "api/v1/other-banners/why-choose";
export const distance_api = "/api/v1/config/distance-api";
export const new_arrival_stores_api = "/api/v1/stores/latest";
export const filtered_stores_api = "/api/v1/stores/get-stores";
export const top_rated_stores = "/api/v1/stores/top-rated";
export const store_details_api = "/api/v1/stores/details";
export const signUp_api = "/api/v1/auth/sign-up";
export const signIn_api = "/api/v1/auth/login";
export const guest_checkout = "api/v1/auth/guest/request";
export const profile_info = "/api/v1/customer/info";
export const store_item_search_api = "/api/v1/items/search";
export const parcel_delivery_instructions =
  "/api/v1/customer/order/parcel-instructions";
export const order_place_api = "/api/v1/customer/order/place";
export const my_orders_api = "/api/v1/customer/order";
export const monthly_order_list_api = "/api/v1/customer/monthly-order/list";
export const monthly_order_remove_api = "/api/v1/customer/monthly-order/remove";
export const last_orders_api = "/api/v1/customer/order/last";
export const last_trips_api = "/api/v1/rental/customer/trip/last";
export const reorder_api = "/api/v1/customer/order-again/reorder";
export const rental_reorder_api = "/api/v1/rental/user/trip/reorder";
export const service_rebook_api = "/api/v1/service/customer/booking/re-booking";
export const user_info_api = "/api/v1/customer/info";
export const remove_account_api = "/api/v1/customer/remove-account";
export const profile_update_api = "/api/v1/customer/update-profile";
export const coupon_list_api = "/api/v1/coupon/list";
export const similar_product_api = "/api/v1/items/related-items";
export const discounted_product_api = "/api/v1/items/discounted";
export const discounted_stores_api = "/api/v1/stores/discounted";
export const popular_items_in_store = "api/v1/items/recommended";
export const suggested_items_api = "/api/v1/items/suggested";
export const common_condition_product_in_store =
  "/api/v1/items/common-conditions";
export const wallet_transactions_list_api =
  "/api/v1/customer/wallet/transactions";
export const LP_transactions_list_api =
  "/api/v1/customer/loyalty-point/transactions";
export const Loyalty_points_transfer_api =
  "/api/v1/customer/loyalty-point/point-transfer";

export const address_list_api = "/api/v1/customer/address/list";
export const add_address_api = "/api/v1/customer/address/add";
export const update_address_api = "/api/v1/customer/address/update";
export const delete_address_api = "/api/v1/customer/address/delete";
export const refund_policy_api = "/refund";
export const product_reviews_api = "/api/v1/items/reviews";
export const add_wish_list_api = "/api/v1/customer/wish-list/add";
export const get_wish_list_api = "/api/v1/customer/wish-list";
export const delete_wish_list_api = "/api/v1/customer/wish-list/remove";
export const get_channel_list = "/api/v1/customer/message/list";
export const get_conversations_api = "/api/v1/customer/message/details";
export const store_message_api = "/api/v1/customer/message/send";
export const channel_search_api = "/api/v1/customer/message/search-list";
export const cm_firebase_token_api = "/api/v1/customer/cm-firebase-token";
export const suggestedProducts_api = "/api/v1/customer/suggested-items";
export const suggested_items_stores = "/api/v1/items/item-or-store-search";
export const order_details_api = "/api/v1/customer/order/details";
export const track_order_api = "/api/v1/customer/order/track";
export const order_cancel_api = "/api/v1/customer/order/cancel";
export const offline_payment_options = "/api/v1/offline_payment_method_list";
export const update_payment_method_api =
  "/api/v1/customer/order/payment-method";
export const refund_reasons_api = "/api/v1/customer/order/refund-reasons";
export const testimonial_api = "/api/v1/testimonial";
export const categories_details_api = "/api/v1/categories/items";
export const categories_details_Store_api = "/api/v1/categories/stores";
export const store_categories_items_api = "/api/v1/store-categories/items";
export const store_popular_items_api = "/api/v1/stores/popular-items";
export const categories_Childes_api = "/api/v1/categories/childes";
export const basic_campaigns_api = "api/v1/campaigns/basic";
export const basic_campaigns_details_api =
  "/api/v1/campaigns/basic-campaign-details";
export const typewise_store_api = "/api/v1/stores";
export const social_login_api = "/api/v1/auth/social-login";
export const verify_phone_api = "/api/v1/auth/verify-phone";
export const social_register_api = "/api/v1/auth/social-register";
export const store_review_api = "/api/v1/stores/reviews";
export const submit_items_review_api = "/api/v1/items/reviews/submit";
export const submit_deliveryman_review_api =
  "/api/v1/delivery-man/reviews/submit";

export const update_interest_api = "/api/v1/customer/update-interest";
export const landing_page_api = "/api/v1/react-landing-page";
export const most_trips = "/api/v1/most-tips";

export const wallet_bonuses = "/api/v1/customer/wallet/bonuses";
export const add_fund_to_wallet = "api/v1/customer/wallet/add-fund";
export const product_review_api = "/api/v1/items/related-items";
export const item_add_to_cart = "api/v1/customer/cart/add";
export const cart_all_item_remove = "api/v1/customer/cart/remove";
export const all_cart_list = "api/v1/customer/cart/list";
export const cart_get_all = "api/v1/customer/cart/list";
export const cart_item_delete = "api/v1/customer/cart/remove-item";
export const cart_item_update = "api/v1/customer/cart/update";
export const last_item_review = "api/v1/customer/review-reminder";
export const cancel_last_item_review = "api/v1/customer/review-reminder-cancel";
export const get_search_page_data = "api/v1/get-combined-data";
export const cashback_list = "api/v1/cashback/list";
export const cashback_amount = "api/v1/cashback/getCashback";
export const brand_list = "api/v1/brand";
export const brand_products = "api/v1/brand/items/";
export const visit_again = "api/v1/customer/visit-again";
export const paid_ads = "api/v1/advertisement/list";
export const firebase_otp = "api/v1/auth/firebase-verify-token";
export const firebase_reset_password = "api/v1/auth/firebase-reset-password";
export const automated_message = "api/v1/customer/automated-message";
export const check_zone = "api/v1/zone/check";
export const subscription_package = "/api/v1/vendor/package-view";
export const store_registration = "api/v1/auth/vendor/register";
export const store_business_plan = "/api/v1/vendor/business_plan";
export const top_offer_near_me = "api/v1/stores/top-offer-near-me";
export const offers_items_api = "/api/v1/offers/items";
export const offers_stores_api = "/api/v1/offers/stores";
export const top_offer_api = "/api/v1/module/top-offer";
export const happy_hour_running_api = "/api/v1/happy-hour/running";
export const happy_hour_stores_api = "/api/v1/happy-hour/stores";
export const bogo_home_api = "/api/v1/bogo/home";
export const bogo_offers_api = "/api/v1/bogo/offers";
export const bogo_store_offers_api = "/api/v1/bogo/store-offers";
export const exclusive_deals_stores_api = "/api/v1/stores/exclusive-deals";
export const delivery_men_store = "api/v1/delivery-man/store";
export const vehicle_list = "/api/v1/get-vehicles";
export const zone_list = "/api/v1/zone/list";
export const delivery_man_registaration = "api/v1/auth/delivery-man/store";

export const wishlist_api = "/api/v1/rental/user/wish-list";
export const add_wishlist_api = "/api/v1/rental/user/wish-list/add";
export const delete_wishlist_api = "/api/v1/rental/user/wish-list/remove";
// export const zone_list = "/api/v1/zone/list";
export const comfirm_booking_list = "/api/v1/rental/user/cart/get-cart";
export const latest_provider = "api/v1/rental/provider/latest";
export const provider_banner = "api/v1/rental/banners";
export const vehicle_review = "/api/v1/rental/vehicle/reviews";
export const rental_coupon_list_api = "/api/v1/rental/coupon/list ";
export const trip_details = "api/v1/rental/user/trip/get-trip-details";
export const popular_provider = "api/v1/rental/provider/popular";
export const vehicle_category_list = "/api/v1/rental/vehicle/category-list";
export const removeAllCartItems = "api/v1/rental/user/cart/remove-cart";
export const recommended_provider = "api/v1/stores/recommended";
export const quick_delivery_stores_api = "/api/v1/stores/quick-delivery";
export const tax_api = "api/v1/customer/order/get-Tax";
// One call for the whole checkout price breakdown — delivery, surge, Pro,
// tax and cashback. Supersedes assembling those from separate endpoints.
export const checkout_summary_api = "/api/v1/customer/order/checkout-summary";
// Zone-scoped area / zip-code list for the delivery-charge rule. `type` says
// which rule the zone prices by, so the checkout only asks for a selection
// when it is area_wise or zip_code_wise.
export const delivery_coverage_list_api = "/api/v1/delivery-charge/coverage-list";
export const surge_price = "/api/v1/customer/order/get-surge-price";
export const item_details_api = "/api/v1/items/details";
export const confirm_return_parcel = "api/v1/customer/order/parcel-return";
export const wallet_payment_api = "/api/v1/customer/order/wallet-payment";
export const payment_failed_api = "/api/v1/customer/order/payment-failed";
export const reels_list_api = "/api/v1/customer/reels/list";
export const reels_details_api = "/api/v1/customer/reels/details";
export const reels_stats_api = "/api/v1/customer/reels/stats";
export const reels_like_api = "/api/v1/customer/reels/like";
export const reels_visit_api = "/api/v1/customer/reels/visit";
export const app_download_section_api = "/api/v1/app-download-section";
export const saved_files_store_api = "/api/v1/customer/saved-files/store";
export const saved_files_list = "/api/v1/customer/saved-files";
export const saved_files_delete_all_api =
  "/api/v1/customer/saved-files/delete-all";

export const pro_plans = "/api/v1/pro-customer/plans";
export const pro_active_offer = "/api/v1/customer/pro-customer/active-offer";
export const pro_subscribe = "/api/v1/customer/pro-customer/subscribe";
export const pro_cancel = "/api/v1/customer/pro-customer/cancel";
export const pro_faqs = "/api/v1/pro-customer/faqs";
export const pro_terms = "/api/v1/pro-customer/terms-and-conditions";
export const trending_searches_api = "/api/v1/trending-searches";

export const ai_chat_conversations_api =
  "/api/v1/customer/ai-chat/conversations";
export const ai_chat_messages_api = "/api/v1/customer/ai-chat/messages";
export const ai_chat_send_api = "/api/v1/customer/ai-chat/send";

export const bundle_home_api = "/api/v1/bundle/home";
export const bundle_list_api = "/api/v1/bundle/list";
export const bundle_store_bundles_api = "/api/v1/bundle/store-bundles";
export const bundle_details_api = "/api/v1/bundle";
export const bundle_cart_add_api = "/api/v1/customer/cart/bundle/add";
export const bundle_cart_update_api = "/api/v1/customer/cart/bundle/update";
export const bundle_cart_remove_api = "/api/v1/customer/cart/bundle/remove";
export const cart_discount_eligibility_api =
  "/api/v1/customer/cart/discount-eligibility";
export const bogo_cart_add_api = "/api/v1/customer/cart/bogo/add";
export const bogo_cart_update_api = "/api/v1/customer/cart/bogo/update";
export const bogo_cart_remove_api = "/api/v1/customer/cart/bogo/remove";

// ============================================================================
// Cross-border checkout
// ============================================================================
export const cross_border_countries_api = "/api/v1/cross-border/countries";
export const cross_border_shipping_options_api =
  "/api/v1/cross-border/shipping-options";
export const cross_border_quote_api = "/api/v1/cross-border/quote";

// ============================================================================
// Intra-African Agricultural Trade API Routes
// ============================================================================
export const trade_corridors_api = "/api/v1/trade/corridors";
export const trade_corridor_detail_api = (origin, destination) => `/api/v1/trade/corridors/${origin}/${destination}`;
export const trade_corridors_by_bloc_api = (slug) => `/api/v1/trade/blocs/${slug}/corridors`;
export const trade_customs_duty_calculate_api = "/api/v1/trade/customs-duties/calculate";
export const trade_blocs_api = "/api/v1/trade/blocs";
export const trade_bloc_detail_api = (slug) => `/api/v1/trade/blocs/${slug}`;
export const trade_requests_api = "/api/v1/trade/requests";
export const trade_request_detail_api = (id) => `/api/v1/trade/requests/${id}`;
export const trade_request_quotes_api = (id) => `/api/v1/trade/requests/${id}/quotes`;
export const trade_quote_accept_api = (id) => `/api/v1/trade/quotes/${id}/accept`;
export const trade_quote_reject_api = (id) => `/api/v1/trade/quotes/${id}/reject`;
export const trade_documents_upload_api = "/api/v1/trade/documents/upload";
export const trade_documents_api = (id) => `/api/v1/trade/requests/${id}/documents`;
export const trade_contract_create_api = "/api/v1/trade/contracts/create";
export const trade_contract_deposit_api = (id) => `/api/v1/trade/contracts/${id}/deposit`;
export const trade_contract_confirm_delivery_api = (id) => `/api/v1/trade/contracts/${id}/confirm-delivery`;
export const trade_contract_verify_docs_api = (id) => `/api/v1/trade/contracts/${id}/verify-documents`;
export const trade_contract_release_api = (id) => `/api/v1/trade/contracts/${id}/release`;
export const trade_contract_refund_api = (id) => `/api/v1/trade/contracts/${id}/refund`;
export const trade_contract_summary_api = (id) => `/api/v1/trade/contracts/${id}/summary`;
export const trade_contract_view_api = (id) => `/api/v1/trade/contracts/${id}`;
export const trade_assurance_request_api = (id) => `/api/v1/trade/assurance/${id}/request`;
export const trade_assurance_inspect_api = (id) => `/api/v1/trade/assurance/${id}/inspect`;
export const trade_assurance_status_api = (id) => `/api/v1/trade/assurance/${id}/status`;
export const trade_bulk_tiers_api = (itemId) => `/api/v1/trade/bulk-items/${itemId}/tiers`;
export const trade_bulk_calculate_price_api = (itemId) => `/api/v1/trade/bulk-items/${itemId}/calculate-price`;
export const trade_standing_orders_api = "/api/v1/trade/standing-orders";
export const trade_standing_order_cancel_api = (id) => `/api/v1/trade/standing-orders/${id}/cancel`;
export const trade_standing_orders_due_api = "/api/v1/trade/standing-orders/due";
export const trade_sourcing_create_api = "/api/v1/trade/sourcing";
export const trade_sourcing_list_api = "/api/v1/trade/sourcing";
export const trade_sourcing_match_sellers_api = (id) => `/api/v1/trade/sourcing/${id}/match-sellers`;
export const trade_sourcing_my_requests_api = "/api/v1/trade/sourcing/my-requests";
export const trade_seller_dashboard_api = "/api/v1/trade/seller/dashboard";
export const trade_seller_rfq_respond_api = (id) => `/api/v1/trade/seller/rfq/${id}/respond`;
export const trade_seller_upgrade_gold_api = "/api/v1/trade/seller/upgrade-gold";
export const trade_reports_corridors_api = "/api/v1/trade/reports/corridors";
export const trade_reports_commodities_api = "/api/v1/trade/reports/commodities";
export const trade_reports_countries_api = "/api/v1/trade/reports/countries";
export const trade_integrations_freight_webhook_api = "/api/v1/trade/integrations/freight/webhook";
export const trade_integrations_customs_submit_api = "/api/v1/trade/integrations/customs/submit";
export const trade_integrations_bank_payout_api = "/api/v1/trade/integrations/bank/payout";
export const trade_integrations_payment_webhook_api = (gateway) => `/api/v1/trade/integrations/payment/webhook/${gateway}`;
export const trade_integrations_gateways_api = "/api/v1/trade/integrations/gateways";
