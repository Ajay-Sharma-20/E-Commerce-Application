import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import CategoryForm from "./pages/admin/CategoryForm";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminLayout from "./pages/admin/AdminLayout";

// import { useAuth } from "./context/AuthContext";


function App() {




  return (
    <div className="min-h-screen">

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>


        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />

            <Route
              path="/admin/products/new"
              element={<ProductForm />}
            />

            <Route
              path="/admin/products/edit/:id"
              element={<ProductForm />}
            />

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/categories/new"
              element={<CategoryForm />}
            />

            <Route
              path="/admin/categories/edit/:id"
              element={<CategoryForm />}
            />

            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/orders/:id"
              element={<AdminOrderDetails />}
            />

          </Route>
        </Route>

      </Routes>

      <Footer />

    </div>
  );
}

export default App;