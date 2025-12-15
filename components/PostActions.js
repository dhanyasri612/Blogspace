"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostActions({ postId, authorId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
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
        }
      } catch (error) {
        console.error("Error parsing user data", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    if (!user || !user._id) {
      alert("Please login to delete a post");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/post/${postId}?userId=${user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post deleted successfully!");
        router.push("/");
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  // Only show buttons if user is the author
  const isAuthor = user && authorId && (
    user._id?.toString() === authorId.toString() || 
    user._id === authorId?.toString() ||
    user._id === authorId
  );

  if (loading || !isAuthor) {
    return null;
  }

  return (
    <div className="mt-3 mb-3 text-center">
      <Link
        href={`/edit-post/${postId}`}
        className="mx-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        Edit Post
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mx-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        style={{ border: "none", cursor: deleting ? "not-allowed" : "pointer" }}
      >
        {deleting ? "Deleting..." : "Delete Post"}
      </button>
    </div>
  );
}

