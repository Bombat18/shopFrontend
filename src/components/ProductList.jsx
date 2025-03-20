import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import bgimage from "../assets/bg.jpg"
import EarthLoader from "./EarthLoader";



const ProductList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', costprice: '', sellprice: '', quantity: '', unit: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterOption, setFilterOption] = useState('shopname');

  const fetchProducts = async () => {
    
    try {
      setLoading(true); // Keep loading true initially
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.map(product => ({
        ...product,
        pricePerQuantity: product.costprice && product.quantity
          ? (product.costprice / product.quantity).toFixed(2)
          : 0,
      })));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    finally {
      setLoading(false); // Ensure loading is set to false after API call completes
    }
  };
  
  useEffect(() => {
    fetchProducts();
     // Cleanup on unmount
  }, []);
    

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      setProducts(prev => prev.filter(product => product._id !== id));
      closeModal();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = () => {
    if (!selectedProduct) return;
    setEditingProduct(selectedProduct._id);
    setFormData({
      name: selectedProduct.name,
      costprice: selectedProduct.costprice,
      sellprice: selectedProduct.sellprice || '',
      quantity: selectedProduct.quantity,
      unit: selectedProduct.unit,
      shopname: selectedProduct.shopname || ''  // Correctly set shopname
    });
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const updatedProduct = {
        ...formData,
        pricePerQuantity: formData.costprice && formData.quantity
          ? (formData.costprice / formData.quantity).toFixed(2)
          : 0,
      };
      await axios.put(`${API_BASE_URL}/api/products/${editingProduct}`, updatedProduct);
      setProducts(prev => prev.map(product => product._id === editingProduct ? { ...product, ...updatedProduct } : product));
      closeModal();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditingProduct(null);
    setSelectedProduct(null);
    setFormData({ name: '', costprice: '', sellprice: '', quantity: '', unit: '', shopname: '' });
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === 'shopname') {
          return (a.shopname || '').localeCompare(b.shopname || '');
        } else {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
      });
  }, [products, searchQuery, filterOption]);

  return (
    <div className='min-h-screen bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bgimage})`, backgroundAttachment: 'fixed' }}>

      <div className="inset-0 bg-black  opacity-30 fixed w-full h-full"></div>
      <div className="max-w-6xl mx-auto p-3 relative z-10">
        <div className=" rounded-lg shadow-lg px-3">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-500      "> <span className='text-white'>P</span>roduct List</h2>
          <div className="flex items-center gap-4 mb-6">
            {/* Search Input (60% width) */}
            <div className="relative flex-[3]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-6 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Search by product name..."
              />
              {/* Search Icon */}
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                🔍
              </span>
            </div>

            {/* Filter Dropdown (40% width) */}
            <div className="relative flex-[2]">
              <select
                className="appearance-none w-full py-3 px-4 border border-gray-300 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition pr-10"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="shopname">🏪 Shop </option>
                <option value="time">⏳ Time</option>
              </select>
              {/* Dropdown Arrow Icon */}
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                ▼
              </span>
            </div>
          </div>



          {loading ? (
            <div className="flex justify-center items-center py-10 h-full">

              <EarthLoader/>
            </div>
          ) : (

            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-500 text-white text-left">
                  <th className="border border-gray-300 py-4 px-3 font-semibold">Product</th>
                  <th className="border border-gray-300 py-4 px-3 font-semibold">Quantity</th>
                  <th className="border border-gray-300 py-4 px-3 font-semibold">Cost Price</th>
                  <th className="border border-gray-300 py-4 px-3 font-semibold">Single Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    className={`text-center cursor-pointer transition hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                      }`}
                    onClick={() => handleRowClick(product)}
                  >
                    <td className="border border-gray-300 p-3 font-medium">
                      {product.name}
                      <br />
                      <span className="text-red-500 text-sm">({product.shopname})</span>
                    </td>
                    <td className="border border-gray-300 p-3">{product.quantity} {product.unit}</td>
                    <td className="border border-gray-300 p-3 text-orange-500 font-semibold">₹{product.costprice}</td>
                    <td className="border border-gray-300 p-3 text-green-600 font-semibold">₹{product.pricePerQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        </div>
      </div>
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30 p-5">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Manage Product</h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(selectedProduct._id)}
                className="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
              >
                🗑️ Delete
              </button>
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full bg-gray-400 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-600 transition"
            >
              ❌ Cancel
            </button>
          </div>
        </div>

      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-5">
          <div className="bg-white rounded-lg shadow-md w-96 p-5">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <label className="block text-gray-700">Product Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md mb-2" />

            <label className="block text-gray-700">Shop Name:</label>
            <input
              type="text"   // Changed from "number" to "text" because "shopname" should be a string
              name="shopname"
              value={formData.shopname}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md mb-2"
            /> <label className="block text-gray-700">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full p-2 border rounded-md mb-2" />

            <label className="block text-gray-700">Cost Price:</label>
            <input type="number" name="costprice" value={formData.costprice} onChange={handleInputChange} className="w-full p-2 border rounded-md mb-2" />

            <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</button>
            <button onClick={closeModal} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProductList;
