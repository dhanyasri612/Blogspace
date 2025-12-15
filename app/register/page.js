"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";


const page = () => {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const userHandle = (e) =>{
    setUser({...user, [e.target.name]:e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Registration logic here
    fetch(process.env.NEXT_PUBLIC_API_URL + "/user", {
      method: "POST",
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => {
        // Handle response
        setUser({});
       setMessage(res.message);
        setTimeout(()=>{  
          setMessage("");
        },3000);
      }); 
  }
  return (
    <div>
      <div>
        <br />
        <br />
        <br />
        <br />
        <div className="container " style={{ maxWidth: "1000px" }}>
          <form
            className="border border-2 rounded border-info p-3 m-5"
            style={{ background: "rgba(220, 248, 246, 0.49)" }}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center ">Register Page</h2>
            <label className="form-label">UserName</label>
            <input
              type="text"
              className="form-control"
              style={{ background: "rgba(200, 244, 246, 1)" }}
              placeholder="Enter your name"
              name="username"
              value={user.username??""}
              onChange={userHandle}
            />
            <label className="form-label mt-3">Email</label>
            <input
              type="email"
              className="form-control"
              style={{ background: "rgba(200, 244, 246, 1)" }}
              placeholder="Enter your email"
              name="email"
              value={user.email??""}
              onChange={userHandle}
            />
            <label className="form-label mt-3">Password</label>
            <input
              type="password"
              className="form-control"
              style={{ background: "rgba(200, 244, 246, 1)" }}
              placeholder="Enter your password"
              name="password"
              value={user.password??""}
              onChange={userHandle}
            />
            <button className="btn btn-info mt-4 w-100 text-white">
              Register
            </button>
          </form>
          <p className="text-center text-secondary text-capitalize">
            {" "}
            <Link href="/login">Login</Link>
          </p>
        </div>
        <br />
        {message && (
          <p className="text-center text-success font-weight-bold">
            {message}
          </p>
        )}
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default page;
