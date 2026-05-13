
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Banner from "./components/Banner";
import FeaturedProducts from "./components/FeaturedProducts";
import Deals from "./components/Deals";
import Trending from "./components/Trending";
import Brands from "./components/Brands";
import Footer from "./components/Footer";

// Pages
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";




// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminProtected from "./admin/AdminProtected";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AddProduct from "./admin/pages/AddProduct";
import ProductList from "./admin/pages/ProductList";
import EditProduct from "./admin/pages/EditProduct";
import Orders from "./admin/pages/Orders";

import AIChatbot from "./components/AIChatbot";


// 🏠 HOME (NO separate file)
function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Products />
      <Banner />
      <FeaturedProducts />
      
      <Deals />
      <Trending />
      <Brands />
      <AIChatbot />
     
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER ROUTES */}
        <Route path="/" element={<Layout />}>
          
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Login />} />
           <Route path="register" element={<Register />} />
          <Route path="products" element={<Products />} />
           <Route path="services" element={<Services />} />
  <Route path="contact" element={<Contact />} />
  <Route path="wishlist" element={<Wishlist />} />


        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;