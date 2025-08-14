import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/protected-route";

const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const CreateCompany = lazy(() => import("@/pages/create-company"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/create-company" element={<CreateCompany />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
