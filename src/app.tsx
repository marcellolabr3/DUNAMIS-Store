import { Route, Switch } from 'react-router-dom';

import { AdminProtectedRoute } from './components/admin-protected-route';
import { AdminLayout } from './layouts/admin-layout';
import { PublicLayout } from './layouts/public-layout';
import { AdminCustomizationPage } from './pages/admin-customization-page';
import { AdminAdminsPage } from './pages/admin-admins-page';
import { AdminCategoriesPage } from './pages/admin-categories-page';
import { AdminLogsPage } from './pages/admin-logs-page';
import { AdminProductsPage } from './pages/admin-products-page';
import { AdminOverviewPage } from './pages/admin-overview-page';
import { AdminOrdersPage } from './pages/admin-orders-page';
import { AdminReportsPage } from './pages/admin-reports-page';
import { AdminStockPage } from './pages/admin-stock-page';
import { AdminLoginPage } from './pages/admin-login-page';
import { CartPage } from './pages/cart-page';
import { CatalogPage } from './pages/catalog-page';
import { CheckoutPage } from './pages/checkout-page';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { OrderTrackingPage } from './pages/order-tracking-page';
import { ProductPage } from './pages/product-page';

export function App() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin">
        <AdminProtectedRoute>
          <AdminLayout>
            <Switch>
              <Route exact path="/admin" component={AdminOverviewPage} />
              <Route path="/admin/pedidos" component={AdminOrdersPage} />
              <Route path="/admin/produtos" component={AdminProductsPage} />
              <Route path="/admin/categorias" component={AdminCategoriesPage} />
              <Route path="/admin/estoque" component={AdminStockPage} />
              <Route path="/admin/banners" component={AdminCustomizationPage} />
              <Route
                path="/admin/configuracoes"
                component={AdminCustomizationPage}
              />
              <Route path="/admin/relatorios" component={AdminReportsPage} />
              <Route
                path="/admin/administradores"
                component={AdminAdminsPage}
              />
              <Route path="/admin/logs" component={AdminLogsPage} />
              <Route component={AdminOverviewPage} />
            </Switch>
          </AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route>
        <PublicLayout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/catalogo" component={CatalogPage} />
            <Route path="/produto/:slug" component={ProductPage} />
            <Route path="/pedido" component={OrderTrackingPage} />
            <Route path="/carrinho" component={CartPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </PublicLayout>
      </Route>
    </Switch>
  );
}
