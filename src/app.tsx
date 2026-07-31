import { Route, Switch } from 'react-router-dom';

import { PublicLayout } from './layouts/public-layout';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';

export function App() {
  return (
    <PublicLayout>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </PublicLayout>
  );
}
