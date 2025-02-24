import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Assets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    productname: "",
    price: "",
    quantity: "",
    date: "",
    productImage: "",
  });

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products/get");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching Products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({
        ...formData,
        productImage: e.target.files[0],
      });
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("productname", formData.productname);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("date", formData.date);

    // Append productImage only if it exists
    if (formData.productImage) {
      formDataToSend.append("productImage", formData.productImage);
    }

    try {
      const url = editingProduct
        ? `http://localhost:3000/products/edit/${editingProduct._id}`
        : "http://localhost:3000/products/post";
      const method = editingProduct ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: "Success",
          text: editingProduct ? "Product updated successfully" : "Product saved successfully",
          icon: "success",
        });
        setFormData({
          productname: "",
          price: "",
          quantity: "",
          date: "",
          productImage: "",
        });
        setEditingProduct(null); // Reset editing product
        fetchProducts(); // Fetch updated products list
        setIsModalOpen(false); // Close modal
      }
    } catch (error) {
      console.error("Product error:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  // Handle Delete
  const handleDelete = async (Id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/products/delete/${Id}`);
      if (response.status === 200) {
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== Id));
        Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete product.",
        icon: "error",
      });
    }
  };

  // Handle Edit
  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit); // Set the product being edited
      setFormData({
        productname: productToEdit.productname,
        price: productToEdit.price,
        quantity: productToEdit.quantity,
        date: productToEdit.date,
        productImage: productToEdit.productImage, // Preserve the existing image
      });
      setIsModalOpen(true); // Open the modal
    }
  };

  // Filter Products
  const filteredProducts = products.filter((product) =>
    product.productname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative h-screen p-4">
      {/* Search Bar */}
      <div className="absolute top-0">
        <input
          className="h-[40px] w-[150px] border-2 rounded-sm p-3"
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Here"
        />
      </div>

      {/* Add Asset Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => {
            setEditingProduct(null); // Reset editing product
            setIsModalOpen(true);
          }}
          className="h-[40px] w-[120px] bg-blue-600 hover:bg-blue-700 rounded-2xl text-xl text-white transition"
        >
          + Product
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
          onClick={() => setIsModalOpen(false)} // Close modal on clicking outside
        >
          <div
            className="bg-gray-300 p-6 rounded-lg shadow-lg w-[400px]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h1 className="text-lg font-semibold text-red-800 mb-4 text-center">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h1>
            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Product Name:</label>
                <input
                  type="text"
                  name="productname"
                  value={formData.productname}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-gray-700">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-gray-700">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Quantity"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Product Image */}
              <div className="mb-4">
                <label className="block text-gray-700">Product Image:</label>
                <input
                  type="file"
                  name="productImage"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                  required={!editingProduct} // Required only for new products
                />
              </div>

              {/* Product Add Date */}
              <div className="mb-4">
                <label className="block text-gray-700">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-[40px] w-[100px] bg-gray-600 hover:bg-gray-700 rounded-2xl text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[40px] w-[100px] bg-blue-600 hover:bg-blue-700 rounded-2xl text-white transition"
                >
                  {editingProduct ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-500">Product List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="w-full h-40  overflow-hidden object-cover">
                  <img
                    src={product.productImage}
                    alt={product.productname}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <p className="font-semibold text-lg mb-2">{product.productname}</p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ₹{product.price}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Quantity:</span> {product.quantity}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {product.date}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 col-span-full">
              No Product Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assets;