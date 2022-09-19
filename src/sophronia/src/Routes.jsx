import { Route, Routes } from "react-router-dom";
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Films } from './pages/Films';
import { Film } from './pages/Film';

export const Root = () => {
  return (
    <Routes>
      <Route path="/" >
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="home">
              <Route index element={<Dashboard />} />
          </Route>
          <Route path="films">
              <Route index element={<Films />} />
              <Route path=":filmId">
                  <Route index element={<Film />} />
              </Route>
          </Route>
        </Route>

          {/* <Route path="*" element={<NotFound />} /> */}

      </Route>
    </Routes>
  );
}
