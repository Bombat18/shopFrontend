import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const ProductForm = ({ refreshProducts }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    costprice: "",
    unit: "kg",
    pricePerQuantity: 0,
    shopname: ""  // Added shopname
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => {
      const updated = { ...prev, [name]: name === "quantity" || name === "costprice" ? Number(value) : value };

      if (updated.costprice > 0 && updated.quantity > 0) {
        updated.pricePerQuantity = (updated.costprice / updated.quantity).toFixed(2);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (product.costprice < 0 || product.quantity <= 0) {
      setError("Invalid input values. Please ensure all fields are filled correctly.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/products`, product);
      setProduct({ name: "", quantity: "", costprice: "", unit: "kg", pricePerQuantity: 0, shopname: "" });
      refreshProducts();
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center ">
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md"
        >
          <FaPlus /> <span>Add</span>
        </button>
        <button
          onClick={handleRefresh}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-md"
        >
          Refresh
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-5">
          <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              ✖
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Add Product</h2>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 z-10">
              {[{ label: "Product Name", name: "name", type: "text", placeholder: "Enter product name" },
              { label: "Cost Price", name: "costprice", type: "number", placeholder: "Enter cost price", min: 0 },
              ].map(({ label, name, type, placeholder, min }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-lg font-medium text-gray-700">
                    {label}:
                  </label>
                  <input
                    type={type}
                    name={name}
                    id={name}
                    value={product[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    min={min}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              ))}

              {/* Quantity & Unit on the same row */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={product.quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    min="1"
                    required
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="w-1/2">
                  <label htmlFor="unit" className="block text-lg font-medium text-gray-700">
                    Unit:
                  </label>
                  <select
                    name="unit"
                    id="unit"
                    value={product.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {["kg", "Bag", "Pac", "Lit"].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Shop Name - Placed Second Last */}
              <div>
                <label htmlFor="shopname" className="block text-lg font-medium text-gray-700">
                  Shop Name:
                </label>
                <input
                  type="text"
                  name="shopname"
                  id="shopname"
                  value={product.shopname}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                  required
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Price per Quantity - Last Input */}
              <div>
                <label htmlFor="pricePerQuantity" className="block text-lg font-medium text-gray-700">
                  Price per Quantity:
                </label>
                <input
                  type="text"
                  id="pricePerQuantity"
                  value={product.pricePerQuantity}
                  disabled
                  className="w-full px-4 py-2 border rounded-md border-gray-300 bg-gray-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;