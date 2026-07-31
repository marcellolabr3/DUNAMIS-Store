import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { PublicStoreSettings } from '../services/public-settings-service';
import { SiteLogo } from './site-logo';

export function PublicFooter({ settings }: { settings?: PublicStoreSettings }) {
  return (
    <footer className="border-t border-border bg-secondary text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <SiteLogo
            inverted
            logoUrl={settings?.logoUrl}
            storeName={settings?.storeName}
          />
          <p className="max-w-sm text-sm leading-6 text-white/70">
            {settings?.storeDescription ||
              'Loja virtual para produtos da igreja, com retirada local e pagamento inicial por Pix manual.'}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-primary">Loja</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link className="hover:text-primary" to="/catalogo">
              Catalogo
            </Link>
            <Link className="hover:text-primary" to="/pedido">
              Acompanhar pedido
            </Link>
            <Link className="hover:text-primary" to="/admin">
              Administracao
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-primary">Contato</h2>
          <ul className="mt-4 grid gap-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MessageCircle aria-hidden="true" size={16} />
              {settings?.whatsappNumber || 'WhatsApp configuravel'}
            </li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" size={16} />
              {settings?.contactEmail || 'contato@dunamisstore.local'}
            </li>
            <li className="flex items-center gap-2">
              <MapPin aria-hidden="true" size={16} />
              Retirada na igreja
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        {settings?.storeName || 'DUNAMIS STORE'}
      </div>
    </footer>
  );
}
