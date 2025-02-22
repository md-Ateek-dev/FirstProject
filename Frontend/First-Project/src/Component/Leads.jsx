import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Leads = ()=>{
  // const [users, setUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    companyname: "",
    companyid: "",
  });


  // 🔹 Fetch Users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/get");
      const data = response.data.users || response.data;
      setUsers(response.data.users || [] );
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };
  // console.log("Users data:", users);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Handle Form Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editUserId) {
        // UPDATE USER (PUT Request)
        console.error("Error: editUserId is undefien!");
        await axios.put(`http://localhost:3000/users/edit/${editUserId}`, formData);
        Swal.fire("Updated!", "User has been updated successfully.", "success");
      } else {
        // ADD NEW USER (POST Request)
        await axios.post("http://localhost:3000/users/post", formData);
        Swal.fire("Added!", "User has been added successfully.", "success");
      }

      // Reset Form
      setFormData({ username: "", email: "", password: "", number: "", companyname: "", companyid: "" });
      setIsModalOpen(false);
      setEditUserId(null);
      fetchUsers(); // Refresh Data
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  // 🔹 Handle Delete Users
  const handleDelete = async (id) => {
    console.log("Deleting User with ID:", id); // Debugging

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Deleting User with ID:", id);
          const response = await axios.delete(`http://localhost:3000/users/${id}`);
          console.log("Deleted!", "user has been deleted.", "success")
          fetchUsers();
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error.response?.data || error.message);
          Swal.fire("Error", "Could not delete user.", "error");
        }
      }
    });
  };
const formOpen=()=>{
  setFormData({
    username: "",
    email: "",
    password: "",
    number: "",
    companyname: "",
    companyid: "",
  })
  setIsModalOpen(true)
}
  // 🔹 Handle Edit Users
  const handleEdit = (userId) => {
    
    const user = users.find((user)=> user._id === userId);
    setFormData({
    username:user.username ,
    email:user.email ,
    password:user.password ,
    number:user.number,
    companyname:user.companyname ,
    companyid:user.companyid, 
    });
    setEditUserId(userId);
    setIsModalOpen(true);
  };
  
  //  User filter Logic
  
   const filteredData = users.filter((user,email) =>
  user.username.toLowerCase().includes(search.toLowerCase()) ||
  user.email.toLowerCase().includes(search.toLowerCase()) ||
  user.number.toLowerCase().includes(search.toLowerCase()) ||
  user.companyid.toLowerCase().includes(search.toLowerCase())
   );
   
  //  Users ka Data ko PDF and Excel Form me Download karne k liye
  
  
   const downloadPDF = () => {
    if (!users || users.length === 0){
      console.error("No data availbale to download");
      return;
    }
    const doc = new jsPDF();
    doc.text("User Data", 20, 10);
    
    // Convert user data to table format
    const tableData = (users || []).map((user, index) => [
      index + 1,
      user.username || "",
      user.email || "",
      user.number || "",
      user.password || "",
      user.companyname || "",
      user.companyid || "",
    ]);

    doc.autoTable({
      head: [["#", "Username", "Email", "Number", "Password", "Companyname", "CompanyID"]],
      body: tableData,
    });

    doc.save("user_data.pdf");
  };
  
  const downloadExcel = () => {
    console.log("User Data:", users);
    if (!users || users.length === 0) {
      console.error("No data available to download.");
      Swal.fire("Error", "No user data availbale!", "error");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Excel file ko generate karein

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "user_data.xlsx");
  };


  return (
    <div className="relative h-screen p-4">
     <div className='absolute top-0'>
       {/* Search Baar */}
       <input className='h-[40px] w-[150px] border-2 rounded-sm p-3' type="text" name='search' value={search} onChange={(e)=> setSearch(e.target.value)} placeholder='Search Here'/>
     </div>
     
     {/* Export to PDF */}
     <div className='absolute right-50 top-0'>
     <button onClick={downloadPDF} className=''><PictureAsPdfIcon className='text-5xl text-red-600'/></button>
     </div>
     {/* Export to Excel */}
     <div className='absolute right-40 top-0'>
     <button onClick={downloadExcel} className=''><DescriptionIcon className='text-5xl text-blue-600'/></button>
     </div>
      {/* Add User Button */}
      <div className="absolute top-0 right-4"> 
        <button onClick={() => formOpen()} className="h-[40px] w-[120px] bg-blue-600 hover:bg-blue-700 rounded-2xl text-xl text-white transition">
          Add User
        </button>
      </div>

      {/* Users Data Table */}
      <div className="container mx-auto p-1">
        <u> 
                 <h1 className="text-2xl font-bold text-center mb-4">User Table</h1>
        </u>
        <div className="overflow-x-auto">
          
          <table className="min-w-full border border-gray-200 shadow-lg rounded-lg">
            <thead className="bg-gray-400 text-white">
              <tr>
                <th className="py-3 px-4 text-left border-2 border-black">Username</th>
                <th className="py-3 px-4 text-left border-2 border-black">Email</th>
                <th className="py-3 px-4 text-left border-2 border-black">Password</th>
                <th className="py-3 px-4 text-left border-2 border-black">Number</th>
                <th className="py-3 px-4 text-left border-2 border-black">Company Name</th>
                <th className="py-3 px-4 text-left border-2 border-black">Company ID</th>
                <th className="py-3 px-4 text-left border-2 border-black">Action</th>
              </tr>
            </thead>
            <tbody> 
              {(filteredData || []).map((user, index) => (
                <tr key={user._id} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition duration-200`}>
                  <td className="py-3 px-4 border">{user.username}</td>
                  <td className="py-3 px-4 border">{user.email}</td>
                  <td className="py-3 px-4 border">{user.password}</td>
                  <td className="py-3 px-4 border">{user.number}</td>
                  <td className="py-3 px-4 border">{user.companyname}</td>
                  <td className="py-3 px-4 border">{user.companyid}</td>
                  <td className="py-3 px-4 border flex justify-center">
                    <button onClick={() => handleEdit(user._id)} className="h-8 w-15 text-blue-500  rounded-2xl m-2"><EditIcon/></button>
                    <button onClick={() => handleDelete(user._id)} className="h-8 w-15 text-red-500  rounded-2xl m-2"><DeleteIcon/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {editUserId ? "UpdateUser" : "Add User"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="current-password"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Number */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Number:</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Company Name */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Company Name:</label>
          <input
            type="text"
            name="companyname"
            value={formData.companyname}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Company ID */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Company ID:</label>
          <input
            type="text"
            name="companyid"
            value={formData.companyid}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={() => {setIsModalOpen(false);
              setEditUserId()
            }}
            className="h-[40px] w-[100px] bg-gray-600 hover:bg-gray-700 rounded-2xl text-white transition">
            Cancel
          </button>
          <button
            type="submit"
            className="h-[40px] w-[100px] bg-blue-600 hover:bg-blue-700 rounded-2xl text-white transition"
          >        
          {editUserId ? "Update" : "Save"}

</button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default Leads;
