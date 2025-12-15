"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const DynamicPost = () => {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
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
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setUser(parsedUser);
          }, 0);
        }
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setPost(data);
        } else {
          console.error("Expected array but got:", data);
          setPost([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPost([]);
      });
  }, []);
  const inputRef = useRef("");
  const searchPost = (e) => {
    if (e.type === "keydown" && e.key !== "Enter") {
      return;
    }
    const query = inputRef.current.value;
    setSearchQuery(query);
    setSearch(true);
    setTimeout(() => {
      fetch("/api/posts?q=" + query)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          // Ensure data is always an array
          if (Array.isArray(data)) {
            setPost(data);
          } else {
            console.error("Expected array but got:", data);
            setPost([]);
          }
        })
        .catch((error) => {
          console.error("Error searching posts:", error);
          setPost([]);
        })
        .finally(() => setSearch(false));
    }, 1000);
  };

  const handleDelete = async (postId, authorId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !user._id) {
      alert("Please login to delete a post");
      return;
    }

    // Verify user is the author
    if (
      user._id !== authorId?.toString() &&
      user._id?.toString() !== authorId
    ) {
      alert("You can only delete your own posts");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/post/${postId}?userId=${user._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        // Remove the post from the list
        setPost(post.filter((p) => p._id !== postId));
        alert("Post deleted successfully!");
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const isAuthor = (authorId) => {
    if (!user || !authorId) return false;
    return (
      user._id === authorId?.toString() || user._id?.toString() === authorId
    );
  };

  return (
    <div>
      <div className="flex justify-content-end pl-5">
        <input
          onKeyDown={searchPost}
          ref={inputRef}
          type="text"
          className="form-control mx-5"
          placeholder="Search Blogs..."
          style={{ width: "500px" }}
        />
        <button
          className="btn btn-success "
          style={{ height: "40px" }}
          onClick={searchPost}
          disabled={search}
        >
          {search ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="row">
        {Array.isArray(post) &&
          post.map((item) => (
            <div key={item._id} className="my-5 col-12 col-md-6 col-lg-4">
              <div className="card  shadow-sm" style={{ position: "relative" }}>
                {/* Delete button - only visible to author */}
                {isAuthor(item.user?._id || item.user) && (
                  <button
                    onClick={(e) =>
                      handleDelete(item._id, item.user?._id || item.user, e)
                    }
                    className="btn btn-danger btn-sm"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 10,
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      padding: 0,
                      fontSize: "14px",
                    }}
                    title="Delete post"
                  >
                    ×
                  </button>
                )}
                <div className="card-body">
                  <Link href={"/post/" + item._id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="card-img-top"
                    />
                  </Link>
                </div>
                <div className="card-title">
                  <h6>{item.title}</h6>
                </div>
                {item.user && (
                  <div className="px-3">
                    <small className="text-muted">
                      <strong>By:</strong>{" "}
                      {item.user.username || item.user.email}
                    </small>
                  </div>
                )}
                <br />
                <div className="p-3 card-text text-justify">
                  {item.short_description}
                </div>
                <div className="card-footer text-muted"></div>
              </div>
            </div>
          ))}
      </div>
      {post.length === 0 && !search && searchQuery && (
        <div className="text-center mt-5 p-5">
          <h3>
            No Blogs Found for query : <b>{searchQuery}</b>
          </h3>
        </div>
      )}
    </div>
  );
};

export default DynamicPost;
