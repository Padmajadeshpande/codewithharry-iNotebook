import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom';

const Signup = (props) => {
  const[credential,setCredentials]=useState({name:"",email:"",password:"",cpassword:""});
  let navigate = useNavigate();
  const handleSubmit=async (e)=>{
    e.preventDefault(); //to avoid page reloading
    const {name,email,password}=credential;
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
   
      method: "POST",
     headers: {
       "Content-Type": "application/json",
      
     },
        body:JSON.stringify({name,email,password})
   });
   const json=await response.json()
        console.log(json)
        if (json.success) {
         // Save the auth token and redirect
         localStorage.setItem('token', json.authtoken);
         navigate("/");
         props.showAlert("Account Created Successfully ","success")
     }
     else {
        props.showAlert("Invalid Credentials","danger")
     }
 }
 const onChange=(e)=>{
     setCredentials({...credential,[e.target.name]:e.target.value})
   }
  return (
    <div className='container mt-2'>
      <h2 className='my-3'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
      <div className="my-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text"  name="name"className="form-control" id="name"onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" name="email"className="form-control" id="email" aria-describedby="emailHelp" onChange={onChange}  />
          <div id="name" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" name="password" className="form-control" id="password" onChange={onChange} required minLength={5} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" name="cpassword" className="form-control" id="cpassword" onChange={onChange} required minLength={5} />
        </div>
       <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
