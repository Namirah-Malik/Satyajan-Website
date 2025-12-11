import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import AdminBlogs from "./pages/AdminBlogs";

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
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
