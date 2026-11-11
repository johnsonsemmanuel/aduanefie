<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\VerifiesHuman;
use App\Models\Admin;
use Gregwar\Captcha\CaptchaBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
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
    use VerifiesHuman;

    public function showLogin()
    {
        if (Auth::guard('admin')->check()) {
            // Only a completed login counts. A session that exists but has not
            // passed the second factor is discarded rather than redirected into
            // the panel, where the admin-mfa middleware would bounce it anyway.
            if (app(\App\Services\AdminMfaService::class)->isVerifiedFor(Auth::guard('admin')->user())) {
                return redirect()->route('admin.dashboard');
            }

            Auth::guard('admin')->logout();
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

        if (!$admin || !Auth::guard('admin')->attempt([
            'email' => $request->email,
            'password' => $request->password,
        ], false)) {
            return back()
                ->withInput($request->only('email', 'remember'))
                ->withErrors(['email' => 'Credentials does not match.']);
        }

        // Password accepted, but that is not a login. begin() destroys the
        // guard session and sends the admin to the second-factor screen.
        // "Remember me" is not offered here; the challenge sets it on success.
        $mode = app(\App\Services\AdminMfaService::class)
            ->begin($request, $admin, $request->boolean('remember'));

        return redirect()->route(
            $mode === \App\Services\AdminMfaService::MODE_SETUP
                ? 'admin.mfa.setup'
                : 'admin.mfa.challenge'
        );
    }

}
