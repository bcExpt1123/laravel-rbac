<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        {{-- Theme detection: cookie (light/dark/system) or system preference --}}
        <script>
            (function() {
                function applyTheme() {
                    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('appearance='));
                    const appearance = cookie ? cookie.split('=')[1].trim() : 'system';

                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

                    document.documentElement.classList.toggle('dark', isDark);
                    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                }
                applyTheme();
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
            })();
        </script>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <style>
            :root {
                --error-bg: #FDFDFC;
                --error-fg: #1b1b18;
                --error-muted: #706f6c;
                --error-border: #e3e3e0;
                --error-accent: #f53003;
            }
            .dark {
                --error-bg: #0a0a0a;
                --error-fg: #EDEDEC;
                --error-muted: #A1A09A;
                --error-border: #3E3E3A;
                --error-accent: #FF4433;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            html {
                background-color: var(--error-bg);
                color-scheme: light;
            }
            html.dark {
                color-scheme: dark;
            }

            body {
                font-family: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background-color: var(--error-bg);
                color: var(--error-fg);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
            }

            .error-container {
                text-align: center;
                max-width: 28rem;
            }

            .error-code {
                font-size: 6rem;
                font-weight: 500;
                line-height: 1;
                color: var(--error-accent);
                margin-bottom: 0.5rem;
                letter-spacing: -0.02em;
            }

            .error-message {
                font-size: 1.125rem;
                color: var(--error-muted);
                margin-bottom: 2rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .error-link {
                display: inline-block;
                padding: 0.375rem 1.25rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--error-fg);
                text-decoration: none;
                border: 1px solid var(--error-border);
                border-radius: 0.125rem;
                transition: border-color 0.15s ease;
            }
            .error-link:hover {
                border-color: var(--error-muted);
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <div class="error-code">@yield('code')</div>
            <div class="error-message">@yield('message')</div>
            <a href="{{ url()->previous() ?: url('/') }}" class="error-link">{{ __('Go Back') }}</a>
        </div>
    </body>
</html>
