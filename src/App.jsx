import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import axios from "axios";

// HomePage (MPIN Login Page)
const HomePage = ({ setAuthenticated }) => {
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  if (localStorage.getItem("authenticated") === "true") {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mpin !== "1990") {
      setError("Invalid MPIN. Please try again.");
    } else {
      setAuthenticated(true);
      localStorage.setItem("authenticated", "true");
      navigate("/products");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login using MPIN
        </h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mpin" className="block text-lg font-medium text-gray-700">
              MPIN:
            </label>
            <input
              type="password"
              name="mpin"
              id="mpin"
              value={mpin}
              onChange={(e) => setMpin(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter MPIN"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ authenticated, children }) => {
  return authenticated ? children : <Navigate to="/" replace />;
};

// Main App Component
const App = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Function to trigger a re-fetch of products
  const refreshProducts = () => {
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  return (
    <Router>
      <Routes>
        {/* Home Route - MPIN Login */}
        <Route path="/" element={<HomePage setAuthenticated={setAuthenticated} />} />

        {/* Protected Products Route */}
        <Route
          path="/products"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <div>
                <ProductForm
                  refreshProducts={fetchProducts}
                  setProducts={setProducts} refresh={refresh}
                />
                <ProductList
                  refresh={refresh}
                  refreshProducts={refreshProducts}
                  products={products}
                />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
