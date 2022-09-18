import { Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from '@Components';
import { Dashboard } from '@Pages';

export const Root = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="home" element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* <Route path="*" element={<NotFound />} /> */}

      </Route>
    </Routes>
  );
}
