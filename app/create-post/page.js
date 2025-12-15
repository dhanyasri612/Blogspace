"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      try {
        if (
          storedUser &&
          storedUser !== "undefined" &&
          storedUser !== "null" &&
          storedUser.trim() !== ""
        ) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // No user found, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error parsing user data", error);
        localStorage.removeItem("user");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("Please login to create a post");
      router.push("/login");
      return;
    }

    const userId = user._id;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("author", userId); // 👈 send author

    await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    alert("Post published!");
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Create New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 space-y-4 mt-5 mb-5 bg-light rounded"
      >
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 mt-5 mb-5"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your post..."
          className="w-full border p-2 h-40 mt-5 mb-5"
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  className="form-control mt-3 mb-4"
  required
/>


        <div className="text-center"><button className="bg-black text-white px-4 py-2 ">Publish</button></div>
      </form>
    </div>
  );
}
