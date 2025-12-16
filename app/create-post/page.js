"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("user");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("Please login");
      router.push("/login");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("author", user._id);

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    setSubmitting(false);

    if (res.ok) {
      alert("Post published!");
      router.push("/");
    } else {
      alert("Failed to publish post");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!user) return null;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Create New Post</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-light rounded"
      >
        <input
          type="text"
          placeholder="Post title"
          className="form-control mb-3 mt-3"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your post..."
          className="form-control mb-3 mt-5"
          rows="6"
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="form-control mb-4 mt-5"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <div className="text-center">
          <button
            className="btn btn-dark mt-5"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
