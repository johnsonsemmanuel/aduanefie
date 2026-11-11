<?php

namespace App\Http\Controllers;

use App\CentralLogics\Helpers;
use App\Models\Admin;
use App\Models\BusinessSetting;
use App\Models\Module;
use Brian2694\Toastr\Facades\Toastr;
use Gregwar\Captcha\CaptchaBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

/**
 * Dedicated admin login.
 *
 * Deliberately separate from LoginController: that controller resolves four
 * roles out of one settings-driven map and login_attemp() only understands
 * 'admin' and 'vendor'. Giving admin its own controller means the most
 * privileged principal is not coupled to the store/vendor role switch.
 */
class AdminAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        [$lang, $direction] = $this->localeAndDirection();

        $locale = session()?->get('local') ?? $lang;
        $siteDirection = session()?->get('site_direction') ?? $direction;
        App::setLocale($locale);

        $captcha = new CaptchaBuilder;
        $captcha->build();
        Session::put('six_captcha', $captcha->getPhrase());

        return view('auth.login', [
            'custome_recaptcha' => $captcha,
            'role' => 'admin',
            'site_direction' => $siteDirection,
            'locale' => $locale,
            'email' => null,
            'password' => null,
            'postRoute' => route('admin.login.submit'),
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (!$this->passesHumanCheck($request)) {
            return back()->withInput($request->only('email', 'remember'));
        }

        $admin = Admin::where('email', $request->email)->where('role_id', 1)->first();

        if (!$admin || !Auth::guard('admin')->attempt(
            ['email' => $request->email, 'password' => $request->password],
            $request->boolean('remember')
        )) {
            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors(['email' => 'Credentials does not match.']);
        }

        $admin->is_logged_in = 1;
        $admin->save();

        $modules = Module::Active()->get();
        if ($modules->count() > 0) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('admin.business-settings.business-setup');
    }

    /**
     * Same two-mode captcha the shared login uses: Google reCAPTCHA when it is
     * enabled, otherwise the session-backed image captcha. Returns false after
     * flashing its own error so the caller can simply redirect back.
     */
    private function passesHumanCheck(Request $request): bool
    {
        $recaptcha = Helpers::get_business_settings('recaptcha');

        if (isset($recaptcha) && $recaptcha['status'] == 1 && !$request->set_default_captcha) {
            $secretKey = Helpers::get_business_settings('recaptcha')['secret_key'];
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => $secretKey,
                'response' => $request->input('g-recaptcha-response'),
                'remoteip' => $request->ip(),
            ]);

            if (!$response->successful()) {
                Toastr::error(translate('ReCaptcha Failed'));
                return false;
            }

            return true;
        }

        if (strtolower((string) session('six_captcha')) !== strtolower((string) $request->input('custome_recaptcha'))) {
            Toastr::error(translate('messages.ReCAPTCHA Failed'));
            return false;
        }

        return true;
    }

    private function localeAndDirection(): array
    {
        $language = BusinessSetting::where('key', 'system_language')->first();
        $lang = 'en';
        $direction = 'ltr';

        if ($language) {
            foreach (json_decode($language->value, true) ?? [] as $item) {
                if (!empty($item['default'])) {
                    $lang = $item['code'];
                    $direction = $item['direction'];
                    break;
                }
            }
        }

        return [$lang, $direction];
    }
}
