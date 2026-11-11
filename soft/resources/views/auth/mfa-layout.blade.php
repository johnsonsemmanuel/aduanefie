<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>@yield('title', 'Two-factor verification')</title>

    <link rel="shortcut icon" href="{{ asset('public/favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/admin/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/admin/css/theme.minc619.css?v=1.0') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/admin/css/style.css') }}">

    <style>
        .mfa-main { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f6fb; padding: 24px; }
        .mfa-card { width: 100%; max-width: 460px; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 12px 40px rgba(20, 32, 60, .12); }
        .mfa-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
        .mfa-sub { color: #5b6b7f; font-size: 14px; margin-bottom: 22px; }
        .mfa-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
        .mfa-input { width: 100%; border: 1px solid #cfd8e3; border-radius: 8px; padding: 12px 14px; font-size: 18px; letter-spacing: .18em; }
        .mfa-input:focus { outline: none; border-color: #039d55; box-shadow: 0 0 0 3px rgba(3, 157, 85, .15); }
        .mfa-btn { display: block; width: 100%; margin-top: 18px; border: 0; border-radius: 8px; background: #039d55; color: #fff; font-weight: 600; padding: 12px 16px; }
        .mfa-btn:hover { background: #028a4a; }
        .mfa-note { color: #5b6b7f; font-size: 13px; margin-top: 18px; }
        .mfa-secret { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; letter-spacing: .12em; background: #f4f6fb; border: 1px dashed #cfd8e3; border-radius: 8px; padding: 14px; text-align: center; word-break: break-all; }
        .mfa-link { display: inline-block; margin-top: 10px; font-size: 13px; }
        .mfa-codes { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 16px; line-height: 2; background: #f4f6fb; border-radius: 8px; padding: 14px 18px; }
        .mfa-back { display: inline-block; margin-top: 18px; font-size: 13px; }
        .alert ul { margin-bottom: 0; padding-left: 18px; }
    </style>
</head>
<body>
<main class="mfa-main">
    <div class="mfa-card">
        <h1 class="mfa-title">@yield('heading', 'Two-factor verification')</h1>
        <p class="mfa-sub">@yield('subheading')</p>

        @if ($errors->any())
            <div class="alert alert-danger" role="alert">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')
    </div>
</main>
</body>
</html>
