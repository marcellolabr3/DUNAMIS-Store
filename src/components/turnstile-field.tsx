import { useEffect, useRef } from 'react';

interface TurnstileFieldProps {
  onVerify: (token: string) => void;
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

export function TurnstileField({ onVerify }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    const configuredSiteKey = siteKey;
    let widgetId = '';
    let cancelled = false;

    function renderWidget() {
      if (!window.turnstile || !containerRef.current || cancelled || widgetId) {
        return;
      }

      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: configuredSiteKey,
        callback: onVerify,
        'expired-callback': () => onVerify('')
      });
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.createElement('script');

      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onVerify]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} />;
}
