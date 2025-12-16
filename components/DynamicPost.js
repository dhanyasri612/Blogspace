"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DynamicPost = () => {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const inputRef = useRef(null);

  /* =========================
     LOAD USER FROM STORAGE
  ========================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user:", error);
      localStorage.removeItem("user");
    }
  }, []);

  /* =========================
     FETCH ALL POSTS
  ========================== */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPost(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setPost([]);
      }
    };

    fetchPosts();
  }, []);

  /* =========================
     SEARCH POSTS
  ========================== */
  const searchPost = async (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    const query = inputRef.current?.value?.trim();
    if (!query) return;

    setSearch(true);
    setSearchQuery(query);

    try {
      const res = await fetch(`/api/posts?q=${query}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setPost(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPost([]);
    } finally {
      setSearch(false);
    }
  };

  /* =========================
     DELETE POST
  ========================== */
  const handleDelete = async (postId, authorId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?._id) {
      alert("Please login to delete a post");
      return;
    }

    if (user._id.toString() !== authorId.toString()) {
      alert("You can only delete your own posts");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/post/${postId}?userId=${user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setPost((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete post");
    }
  };

  /* =========================
     AUTHOR CHECK
  ========================== */
  const isAuthor = (authorId) => {
    if (!user || !authorId) return false;
    return user._id.toString() === authorId.toString();
  };

  return (
    <div>
      {/* SEARCH BAR */}
      <div className="d-flex justify-content-end mb-4">
        <input
          ref={inputRef}
          onKeyDown={searchPost}
          type="text"
          className="form-control me-2"
          placeholder="Search Blogs..."
          style={{ width: "350px" }}
        />
        <button
          className="btn btn-success"
          onClick={searchPost}
          disabled={search}
        >
          {search ? "Searching..." : "Search"}
        </button>
      </div>

      {/* POSTS */}
      <div className="row">
        {post.map((item) => (
          <div key={item._id} className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm position-relative">

              {/* DELETE BUTTON */}
              {isAuthor(item.author?._id || item.author) && (
                <button
                  className="btn btn-danger btn-sm position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    padding: 0,
                  }}
                  onClick={(e) =>
                    handleDelete(item._id, item.author?._id || item.author, e)
                  }
                  title="Delete"
                >
                  ×
                </button>
              )}

              {/* IMAGE (SAFE RENDER) */}
              {item.image && item.image.trim() !== "" && (
                <Link href={`/post/${item._id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                  />
                </Link>
              )}

              <div className="card-body">
                <h6 className="card-title">{item.title}</h6>

                {item.author && (
                  <small className="text-muted d-block mb-2">
                    <strong>By:</strong>{" "}
                    {item.author.username || item.author.email}
                  </small>
                )}

                <p className="card-text">{item.short_description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NO RESULTS */}
      {post.length === 0 && !search && searchQuery && (
        <div className="text-center mt-5">
          <h4>
            No Blogs Found for <b>{searchQuery}</b>
          </h4>
        </div>
      )}
    </div>
  );
};

export default DynamicPost;
