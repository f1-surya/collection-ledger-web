import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Suspense>
  );
}
