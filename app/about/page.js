import React from "react";

const page = () => {
  return (
    <>
      <div className="text-center my-10">
        <h1 className="text-4xl font-bold">Welcome to BlogSpace</h1>
        <p className="mt-4 text-lg text-gray-600">
          BlogSpace is your platform to create, share, and explore blogs
          effortlessly.
        </p>
       
        <img
          src="/images/image.png"
          alt="BlogSpace Platform"
          className="mx-auto mt-6 w-64"
          style={{ borderRadius: "8px" , boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" , height:"400px",width:"400px"
          }}
        />
      </div>

      <br/>

    </>
  );
};

export default page;
