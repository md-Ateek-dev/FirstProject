import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


const Client = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName:"",
    email:"",
    number:"",
    qualification:"",
    status:"",
    clientImage:"",
    password:"",
    DOB:"",
    
  });
  // const formOpen=()=>{
  //   setFormData({
  //     clientName: "",
  //     email: "",
  //     password: "",
  //     number: "",
  //     qualification: "",
  //     status: "",
  //   })
  //   setIsModalOpen(true)
  // }
const fetchClient = async() =>{
  try {
    const response= await axios.get("http://localhost:3000/clients/get");
    const data = response.data.clients || response.data;
    setClients(response.data.Clients || []);
  } catch (error) {
    console.error("Error fetching users:", error);
    setClients([]);
  }
};
useEffect(() =>{
  fetchClient();
}, []);  

const handleInputChange = (e) =>{
  const {name, value} = e.target;
  setFormData({...formData, [name]: value});
};



const handleSubmit = async(e) =>{
  e.preventDefault();
  
  try {
    
  } catch (error) {
    
  }
}
  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Add User Button */}
      <div className="absolute top-0 right-4"> 
        <button onClick={() => formOpen()} className="h-[40px] w-[120px] bg-blue-600 hover:bg-blue-700 rounded-2xl text-xl text-white transition">
          Add User
        </button>
      </div>
    
{isModalOpen && (
      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-blue-400 p-10">
        <h2 className="text-white text-3xl font-bold mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label className="text-white block">Clientname:</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Username" autoComplete="username" />
          </div>
          
          <div className="mb-4">
            <label className="text-white block">Number:</label>
            <input type="text" name="number" value={formData.number} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Number" />
          </div>
          
          <div className="mb-4">
            <label className="text-white block">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Email" autoComplete="email" />
          </div>
          <div className="mb-4">
            <label className="text-white block">DOB:</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="DD/MM/YY" autoComplete="DOB" />
          </div>

          <div className="mb-4">
            <label className="text-white block">Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Password" autoComplete="new-password" />
          </div>

          <div className="mb-4">
            <label className="text-white block">Qlification:</label>
            <select name="qualification" value={formData.qualification} onChange={handleInputChange}>
              <option>Choose</option>
              <option value="diploma">Diploma</option>
              <option value="graduation">Graduation</option>
              <option value="post graduation">Post Graduation</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-white block">Status:</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option>Choose</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-white block">ProfileImage:</label>
            <input type="file" name="clientImage" value={formData.clientImage} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>

          <button type="submit" className="mt-4 w-full bg-white text-black py-2 rounded-md font-bold hover:bg-green-300">
            Save
          </button>
        </form>

      </div>
)}
    </div>
  
  )
}

export default Client