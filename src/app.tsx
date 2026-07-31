import { Route, Switch } from 'react-router-dom';

import { AdminLayout } from './layouts/admin-layout';
import { PublicLayout } from './layouts/public-layout';
import { AdminOverviewPage } from './pages/admin-overview-page';
import { CartPage } from './pages/cart-page';
import { CatalogPage } from './pages/catalog-page';
import { CheckoutPage } from './pages/checkout-page';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { PlaceholderPage } from './pages/placeholder-page';
import { ProductPage } from './pages/product-page';

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
            <Route exact path="/catalogo" component={CatalogPage} />
            <Route path="/produto/:slug" component={ProductPage} />
            <Route path="/pedido">
              <PlaceholderPage
                description="A consulta publica de pedidos sera implementada na etapa correspondente."
                title="Acompanhar pedido"
              />
            </Route>
            <Route path="/carrinho" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </PublicLayout>
      </Route>
    </Switch>
  );
}
