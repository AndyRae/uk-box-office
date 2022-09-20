import { Route, Routes } from "react-router-dom";
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Films } from './pages/Film/Films';
import { Film } from './pages/Film/Film';
import { Distributor } from './pages/Distributor/Distributor';
import { Distributors } from './pages/Distributor/Distributors';
import { Countries } from './pages/Country/Countries';
import { Country } from './pages/Country/Country';

export const Root = () => {
  return (
    <Routes>
      <Route path="/" >
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />

          <Route path="film">
              <Route index element={<Films />} />
              <Route path=":slug">
                  <Route index element={<Film />} />
              </Route>
          </Route>

          <Route path="distributor">
              <Route index element={<Distributors />} />
              <Route path=":slug">
                  <Route index element={<Distributor />} />
              </Route>
          </Route>

          <Route path="country">
              <Route index element={<Countries />} />
              <Route path=":slug">
                  <Route index element={<Country />} />
              </Route>
          </Route>

        </Route>

          {/* <Route path="*" element={<NotFound />} /> */}

      </Route>
    </Routes>
  );
}