import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";


function MainLayout() {

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            <Sidebar />

            <div
                style={{
                    flex: 1,
                    backgroundColor: "#f5f5f5"
                }}
            >

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/inventory"
                        element={<Inventory />}
                    />

                    <Route
                        path="/customers"
                        element={<Customers />}
                    />

                    <Route
                        path="/billing"
                        element={<Billing />}
                    />

                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                </Routes>

            </div>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Public Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Application */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;