import { Route, Switch } from 'react-router-dom';

import { AdminLayout } from './layouts/admin-layout';
import { PublicLayout } from './layouts/public-layout';
import { AdminOverviewPage } from './pages/admin-overview-page';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { PlaceholderPage } from './pages/placeholder-page';

export function App() {
  return (
    <Switch>
      <Route path="/admin">
        <AdminLayout>
          <Switch>
            <Route exact path="/admin" component={AdminOverviewPage} />
            <Route component={AdminOverviewPage} />
          </Switch>
        </AdminLayout>
      </Route>
      <Route>
        <PublicLayout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/catalogo">
              <PlaceholderPage
                description="A listagem de produtos sera implementada na etapa da loja publica."
                title="Catalogo"
              />
            </Route>
            <Route path="/pedido">
              <PlaceholderPage
                description="A consulta publica de pedidos sera implementada na etapa correspondente."
                title="Acompanhar pedido"
              />
            </Route>
            <Route path="/carrinho">
              <PlaceholderPage
                description="O carrinho sera implementado depois do catalogo publico."
                title="Carrinho"
              />
            </Route>
            <Route component={NotFoundPage} />
          </Switch>
        </PublicLayout>
      </Route>
    </Switch>
  );
}
