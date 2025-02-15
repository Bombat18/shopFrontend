import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import bgimage from "../assets/bg.jpg"
import { Oval } from 'react-loader-spinner';

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

 const fetchProducts = async () => {
  try {
    setLoading(true);
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
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products
  .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  .sort((a, b) => a.shopname.localeCompare(b.shopname));


  return (
    <div className='min-h-screen bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bgimage})`, backgroundAttachment: 'fixed' }}>
    
      <div className="inset-0 bg-black  opacity-30 fixed w-full h-full"></div>
      <div className="max-w-6xl mx-auto p-3 relative z-10">
        <div className=" rounded-lg shadow-lg px-3">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300       ">Product List</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-10 w-full py-2  px-6 border border-gray-300  rounded-xl "
            placeholder="Search by product name"
          />
 {loading ? (
            <div className="flex justify-center items-center py-10">
              <Oval color="#ff4500" height={50} width={50} />
            </div>
          ) : (

          <table className="w-full border-collapse border border-gray-300 text-[13px] md:text-base  ">
            <thead>
              <tr className="bg-gray-200  ">
                <th className="border border-black/50 py-5 px-2">Product</th>
                <th className="border border-black/50 py-5 px-2">Quantity</th>
                <th className="border border-black/50 py-5 px-2">Cost Price</th>
                <th className="border border-black/50 py-5 px-2">Single Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="text-center bg-white/90   cursor-pointer" onClick={() => handleRowClick(product)}>
                  <td className="border border-black/50 p-2"> {product.name}  <br /><span className='text-red-600'>( {product.shopname})
                  </span> </td>

                  <td className="border border-black/50 p-2">{product.quantity} {product.unit}</td>
                  <td className="border border-black/50 p-2  text-orange-500 font-semibold">₹{product.costprice}</td>
                  <td className="border border-black/50 p-2 text-green-600 font-semibold">₹{product.pricePerQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30 p-5">
          <div className="bg-white rounded-lg shadow-md w-96 p-5">
            <h2 className="text-xl font-semibold mb-4 text-center">Manage Product</h2>
            <div className='flex justify-evenly'>
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(selectedProduct._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>

            </div>
            <button onClick={closeModal} className="mt-4 w-full bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
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
