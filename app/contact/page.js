"use client"
import React from 'react'
import { useState } from 'react';

const page = () => {
  const [input, setInput] = useState({});
  const [message, setMessage] = useState("");
  const handleInput =(e)=>{
    setInput({...input, [e.target.name]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    fetch(process.env.NEXT_PUBLIC_API_URL+"/enquiry",{
      method:"POST",
      body:JSON.stringify(input),
    })
    .then(res=>res.json())
    .then((res)=>{
      setMessage(res.message);
      setInput({});
      setTimeout(()=>{
        setMessage("");
      },3000)
    })
  }
  return (
    <div>
        <div className="text-center my-10 px-5">
  <h1 className="text-4xl font-bold">Contact Us</h1>
  <p className="mt-4 text-gray-600 text-lg">
    Have questions, feedback, or ideas? 
  </p>
</div>
<section className="max-w-2xl mx-auto px-5 my-16">
  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Your Name"
      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      name='name'
      value = {input.name??""}
      required
      onChange={handleInput}
    />
    <input
      type="email"
      placeholder="Your Email"
      className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      name='email'
      value = {input.email??""}
      required
      onChange={handleInput}
    />
    <textarea
      placeholder="Your Message"
      className="border border-gray-300 rounded px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
      name='message'
      value = {input.message??""}
      required
      onChange={handleInput}
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
    >
      Send Message
    </button>
  </form>
  {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
</section>


    </div>
  )
}

export default page