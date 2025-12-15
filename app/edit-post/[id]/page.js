"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

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

  useEffect(() => {
    if (params?.id && !loading) {
      fetchPost();
    }
  }, [params?.id, loading]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/post/${params.id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }
      const post = await res.json();
      
      // Verify user is the author
      const authorId = post.user?._id || post.user;
      const userId = user?._id?.toString() || user?._id;
      if (authorId?.toString() !== userId && authorId !== userId) {
        alert("You can only edit your own posts");
        router.push(`/post/${params.id}`);
        return;
      }

      setTitle(post.title || "");
      setContent(post.description || "");
      setCurrentImage(post.image || "");
      setPostLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      alert("Failed to load post");
      router.push("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert("Please login to edit a post");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    formData.append("userId", user._id);

    try {
      const res = await fetch(`/api/post/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post updated successfully!");
        router.push(`/post/${params.id}`);
      } else {
        alert(data.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  if (loading || postLoading) {
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
      <h1 className="text-center mb-4">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 space-y-4 mt-5 mb-5 bg-light rounded"
      >
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 mt-5 mb-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your post..."
          className="w-full border p-2 h-40 mt-5 mb-5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {currentImage && (
          <div className="mb-3">
            <p className="mb-2">Current Image:</p>
            <img
              src={currentImage}
              alt="Current post image"
              style={{ maxWidth: "300px", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-5 bg-dark text-white border p-2 mb-5 rounded"
        />
        <p className="text-muted small">
          {image ? "New image selected" : "Leave empty to keep current image"}
        </p>

        <div className="flex gap-2">
          <button type="submit" className="mx-2 bg-black text-white px-4 py-2">
            Update Post
          </button>
          <button
            type="button"
            onClick={() => router.push(`/post/${params.id}`)}
            className="mx-2 bg-gray-500 text-white px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

