
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminMessages from "./pages/AdminMessages";
import NotFound from "./pages/NotFound";

function CustomerLayout() {
    return (
        <>
            <Navbar />

            <main>
                <Routes>
                    {/* PUBLIC PAGES */}
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route
                        path="/shop/product/:id"
                        element={<ProductDetails />}
                    />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />

                    {/* AUTH */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* PROTECTED CUSTOMER PAGES */}
                    <Route element={<ProtectedUserRoute />}>
                        <Route
                            path="/account"
                            element={<Account />}
                        />

                        <Route
                            path="/checkout"
                            element={<Checkout />}
                        />

                        <Route
                            path="/orders"
                            element={<Orders />}
                        />

                        <Route
                            path="/orders/:id"
                            element={<OrderDetails />}
                        />
                    </Route>

                    {/* ADMIN LOGIN */}
                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            <Footer />
        </>
    );
}

function App() {
    return (
        <CurrencyProvider>
            <BrowserRouter>
                <Routes>
                    {/* CUSTOMER WEBSITE */}
                    <Route
                        path="*"
                        element={<CustomerLayout />}
                    />

                    {/* ADMIN PANEL */}
                    <Route element={<ProtectedAdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route
                                path="/admin"
                                element={<AdminDashboard />}
                            />

                            <Route
                                path="/admin/orders"
                                element={<AdminOrders />}
                            />

                            <Route
                                path="/admin/products"
                                element={<AdminProducts />}
                            />

                            <Route
                                path="/admin/messages"
                                element={<AdminMessages />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </CurrencyProvider>
    );
}

export default App;
