import { useEffect, useState, type ReactNode } from 'react';

import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import {
  type PublicStoreSettings,
  getPublicSettings
} from '../services/public-settings-service';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [settings, setSettings] = useState<PublicStoreSettings>();

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const loadedSettings = await getPublicSettings();

        if (!active) {
          return;
        }

        setSettings(loadedSettings);
        applyDocumentBranding(loadedSettings);
      } catch {
        if (active) {
          setSettings(undefined);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <PublicHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <PublicFooter settings={settings} />
    </div>
  );
}

function applyDocumentBranding(settings: PublicStoreSettings) {
  document.title = settings.storeName || 'DUNAMIS STORE';

  if (!settings.faviconUrl) {
    return;
  }

  let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }

  favicon.href = settings.faviconUrl;
}
