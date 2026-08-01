import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// ==========================================
// CUSTOMER PAGES
// ==========================================

import Home from "../pages/Home";

import ProductList from "../pages/ProductList";

import ProductDetails from "../pages/ProductDetails";

import Cart from "../pages/Cart";

import Wishlist from "../pages/Wishlist";

import Checkout from "../pages/Checkout";

import Payment from "../pages/Payment";

import Orders from "../pages/Orders";

import Profile from "../pages/Profile";

import HelpSupport from "../pages/HelpSupport";

import AIShoppingAssistant from "../pages/AIShoppingAssistant";

import OrderTracking from "../pages/OrderTracking";

import SmartRecommendations from
  "../pages/SmartRecommendations";


// ==========================================
// AUTHENTICATION
// ==========================================

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";


// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from
  "../pages/admin/AdminDashboard";

import AdminProducts from
  "../pages/admin/AdminProducts";

import AdminCategories from
  "../pages/admin/AdminCategories";

import AdminOrders from
  "../pages/admin/AdminOrders";

import AdminCustomers from
  "../pages/admin/AdminCustomers";


// ==========================================
// ERROR PAGE
// ==========================================

import NotFound from "../pages/NotFound";


function AppRoutes() {

  return (

    <Routes>

      {/* ====================================== */}
      {/* MAIN LAYOUT */}
      {/* ====================================== */}

      <Route
        element={<MainLayout />}
      >

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* PRODUCTS */}

        <Route
          path="/products"
          element={<ProductList />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* CART AND WISHLIST */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />


        {/* CHECKOUT AND PAYMENT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment/:orderId"
          element={<Payment />}
        />


        {/* CUSTOMER ACCOUNT */}

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* HELP AND SUPPORT */}

        <Route
          path="/help-support"
          element={<HelpSupport />}
        />


        {/* AI SHOPPING ASSISTANT */}

        <Route
          path="/ai-assistant"
          element={
            <AIShoppingAssistant />
          }
        />


        {/* ORDER TRACKING */}

        <Route
          path="/order-tracking"
          element={
            <OrderTracking />
          }
        />


        {/* SMART RECOMMENDATIONS */}

        <Route
          path="/recommendations"
          element={
            <SmartRecommendations />
          }
        />


        {/* ====================================== */}
        {/* ADMIN */}
        {/* ====================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard />
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProducts />
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminCategories />
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminOrders />
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminCustomers />
          }
        />

      </Route>


      {/* ====================================== */}
      {/* AUTHENTICATION */}
      {/* ====================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ====================================== */}
      {/* NOT FOUND */}
      {/* ====================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>

  );

}


export default AppRoutes;