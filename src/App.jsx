import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoutes from "./pages/ProtectedRoutes";

import CityList from "@/components/CityList";
import CountryList from "@/components/CountryList";
import City from "@/components/City";
import Form from "@/components/Form";
import SpinnerFullPage from "@/components/SpinnerFullPage";

const HomePage = lazy(() => import("@/pages/HomePage"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Products = lazy(() => import("@/pages/Products"));
const Login = lazy(() => import("@/pages/Login"));
const AppLayout = lazy(() => import("@/pages/AppLayout"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// import HomePage from "@/pages/HomePage";
// import Pricing from "@/pages/Pricing";
// import Products from "@/pages/Product";
// import NotFound from "@/pages/PageNotFound";
// import Login from "@/pages/Login";
// import AppLayout from "@/pages/AppLayout";

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <Router>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/product" element={<Products />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoutes>
                    <AppLayout />
                  </ProtectedRoutes>
                }
              >
                {/* Navigate let us to redirect to a specific route (the route should be defined as we did below the Navigate) */}
                {/* 'replace' let us back to the previous route by back or ALT + Tab */}
                <Route index element={<Navigate replace to="cities" />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </CitiesProvider>
    </AuthProvider>
  );
}
