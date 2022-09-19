import { Route, Routes } from "react-router-dom";
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

export const Root = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home">
            <Route index element={<Dashboard />} />
          </Route>

          {/* <Route path="*" element={<NotFound />} /> */}

      </Route>
    </Routes>
  );
}
