"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const Router = useRouter();
  const [form, setForm] = useState({});
  function saveForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Login logic here
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    let data = await res.json();
    if (res.status === 200) {
      // Redirect or show success message
      alert("Login successful");
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // Trigger a custom event to notify Header component
        window.dispatchEvent(new Event("userStateChange"));
        // Small delay before navigation to ensure state is set
        setTimeout(() => {
          Router.push("/");
          Router.refresh(); // Force refresh to update the page
        }, 100);
      } else {
        alert("Login successful but user data not received");
      }
    } else {
      alert(data.message);
    }
  }
  return (
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
          <h2 className="text-center ">Login Page</h2>
          <label className="form-label">UserName</label>
          <input
            type="text"
            className="form-control"
            style={{ background: "rgba(200, 244, 246, 1)" }}
            placeholder="Enter your username"
            onChange={saveForm}
            name="username"
            value={form.username ?? ""}
          />
          <label className="form-label mt-3">Password</label>
          <input
            type="password"
            className="form-control"
            style={{ background: "rgba(200, 244, 246, 1)" }}
            placeholder="Enter your password"
            onChange={saveForm}
            name="password"
            value={form.password ?? ""}
          />
          <button className="btn btn-info mt-4 w-100 text-white">Login</button>
        </form>
        <p className="text-center text-secondary text-capitalize">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default page;
