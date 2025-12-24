import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./context/CartContext";
import CallbackPopup from "./components/CallbackPopup";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AdminBlogs from "./pages/AdminBlogs";
import AdminProducts from "./pages/AdminProducts";
import SolarQuotation from "./pages/SolarQuotation";
import Careers from "./pages/Careers";
import JobDetail from "./pages/JobDetail";
import JobApplication from "./pages/JobApplication";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/career/:jobId" element={<JobDetail />} />
            <Route path="/career/apply" element={<JobApplication />} />
          </Routes>
          <Toaster position="top-right" richColors />
          <CallbackPopup />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
