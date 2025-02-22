import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    number: "",
    companyname: "",
    companyid: "",
  });

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/get");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/users/post", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Saved Successfully",
          text: "You clicked the button",
          icon: "success",
        });

        setFormData({
          username: "",
          email: "",
          password: "",
          number: "",
          companyname: "",
          companyid: "",
        });

        fetchUsers();
        navigate("/Login");
      }
    } catch (error) {
      console.error("SignUp error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="container h-[700px] w-[1000px] rounded-3xl flex overflow-hidden shadow-lg">
        <div className="w-1/2 h-full">
          <img src="src/assets/img5.jpg" alt="Signup" className="h-full w-full object-cover" />
        </div>

        <div className="w-1/2 h-full flex flex-col justify-center items-center bg-blue-400 p-10">
          <h2 className="text-white text-3xl font-bold mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="text-white block">Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Username" autoComplete="username" />
            </div>

            <div className="mb-4">
              <label className="text-white block">Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Email" autoComplete="email" />
            </div>

            <div className="mb-4">
              <label className="text-white block">Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Password" autoComplete="new-password" />
            </div>

            <div className="mb-4">
              <label className="text-white block">Number:</label>
              <input type="text" name="number" value={formData.number} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Number" />
            </div>

            <div className="mb-4">
              <label className="text-white block">Company:</label>
              <input type="text" name="companyname" value={formData.companyname} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Company" />
            </div>

            <div className="mb-4">
              <label className="text-white block">Company ID:</label>
              <input type="text" name="companyid" value={formData.companyid} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Enter Company ID" />
            </div>

            <button type="submit" className="mt-4 w-full bg-white text-black py-2 rounded-md font-bold hover:bg-green-300">
              Sign Up
            </button>
          </form>

          <p>
            You have an account? <Link to="/Login" className="text-white underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
