import React, { useState } from "react";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(" Form Data Before API Call:", formData);
  
    try {
      const response = await axios.post("http://localhost:3000/users/login", formData);
      console.log(response);
  
      if (response.status==201) {
        navigate("/Dashboard");
      } else {
        setError("Invalid fields");
      }
    } catch (error) {
      setError("Login failed. Please check your fields.");
    }
  };
  

  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="container h-[700px] w-[1000px] rounded-3xl flex overflow-hidden shadow-lg">
        
        {/* Left Side - Image */}
        <div className="w-1/2 h-full">
          <img src="src/assets/img5.jpg" alt="Login" className="h-full w-full object-cover" />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center bg-blue-400 p-10">
          <h2 className="text-white text-3xl font-bold mb-6">Login</h2>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label className="text-white block">Email:</label>
              <input 
                type="email"
                name="email"
                placeholder="Example@gmail.com"
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="text-white block">Password:</label>
              <input 
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded-md"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="mt-4 w-full bg-white text-black py-2 rounded-md font-bold hover:bg-green-300"
            >
              Login
            </button>
          </form>
          
          <p className="mt-4 text-white">
            Don't have an account? <Link to="/" className="underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
