import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosinstance';

const SignUp = () => {
  const navigate = useNavigate();
  const[email,setEmail] = useState("");
  const[name,setName] = useState("");
  const[password,setPassword] = useState("");
  const[error,setError] = useState(null);
  
  const handleLogin = async(e)=>{
    e.preventDefault();
    if(!name){
      setError("Please enter a name");
      return;
  }
    if(!validateEmail(email)){
        setError("Please enter a valid email address");
        return;
    }
    if(!password){
        setError("Please enter a password");
        return;
    }
    setError("");
    //SIGNUP API CALL
    try{
        const response = await axiosInstance.post("/create-account",{
            fullName:name,
            email:email,
            password:password
        });

        if(response.data && response.data.accessToken){
            localStorage.setItem("token",response.data.accessToken);
            navigate("/dashboard");
        }
    }catch(error){
        if(error.response&&error.response.data&&error.response.data.message){
            setError(error.response.data.message);
        }
        else{
            setError("An unexpected error occurred");
        }
    }
  }
  return (
    <div className='h-screen flex items-center justify-center bg-cyan-100'>
      <div className='w-[900px] h-[500px] flex shadow-lg rounded-lg overflow-hidden bg-white'>
        {/* Left Side - Image & Title */}
        <div className='w-1/2 bg-login-bg-img bg-cover bg-center flex flex-col justify-end p-10 text-white relative' style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/025/871/495/non_2x/travel-destination-background-and-template-design-with-travel-destinations-and-famous-landmarks-and-attractions-for-tourism-let-s-go-travel-illustration-vector.jpg')" }}>
          <div className='absolute inset-0 bg-black/40 rounded-l-lg'></div>
          <div className='relative z-10'>
            <h2 className='text-4xl font-bold'>Capture Your <br /> Memories</h2>
            <p className='text-sm mt-3'>Record your experiences and memories in your personal journal.</p>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className='w-1/2 bg-white p-10 flex flex-col justify-center'>
          <h3 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>SignUp</h3>
          <form onSubmit={handleLogin} className='space-y-4'>

          <input 
              type='name' 
              placeholder='Name' 
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={name}
              onChange={({target})=>{setName(target.value)}}         
            />

            <input 
              type='email' 
              placeholder='Email' 
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={email}
              onChange={({target})=>{setEmail(target.value)}}         
            />
            <input 
              type='password' 
              placeholder='Password' 
              className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              value={password}
              onChange={({target})=>{setPassword(target.value)}}   
            />

            {error&&<p className="text-red-600 text-xs pb-1">{error}</p>}
            <button 
              type='submit' 
              className='w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition'
            >
              SIGNUP
            </button>
          </form>
          <p className='text-center text-sm text-gray-500 mt-4'>Or</p>
          <button 
            className='w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition mt-2'
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
