"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(""); // ✅ image URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  // 🔐 Check login
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

  // 📤 Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      alert("Please login");
      router.push("/login");
      return;
    }

    if (!image.startsWith("http")) {
      alert("Please enter a valid image URL");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        image,       // ✅ URL string
        author: user._id,
      }),
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
        {/* Title */}
        <input
          type="text"
          placeholder="Post title"
          className="form-control mb-3 mt-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Content */}
        <textarea
          placeholder="Write your post..."
          className="form-control mb-3 mt-4"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Image URL */}
        <input
          type="url"
          placeholder="Image URL (https://...)"
          className="form-control mb-4 mt-4"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        {/* Image Preview */}
        {image && (
          <div className="text-center mb-3">
            <img
              src={image}
              alt="Preview"
              style={{ maxHeight: "200px", borderRadius: "8px" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <div className="text-center">
          <button
            className="btn btn-dark mt-3"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
