"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
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
          setUser(JSON.parse(storedUser));
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

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userStateChange"));
      router.push("/login");
      router.refresh();
    }
  };

  // Get first letter of username
  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <div className="container my-5" style={{ maxWidth: "800px" }}>
      <div className="c-profile-page">
        {/* Profile Header */}
        <div className="c-profile-page-header">
          <div className="c-profile-page-icon">{getInitial(user.username)}</div>
          <div className="c-profile-page-info">
            <h1 className="c-profile-page-title">{user.username}</h1>
            <p className="c-profile-page-subtitle">{user.email}</p>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="c-profile-page-card">
          <h2 className="c-profile-page-card-title">Profile Details</h2>
          <div className="c-profile-page-details">
            <div className="c-profile-page-detail-row">
              <div className="c-profile-page-detail-label">Username</div>
              <div className="c-profile-page-detail-value">{user.username}</div>
            </div>
            <div className="c-profile-page-detail-row">
              <div className="c-profile-page-detail-label">Email</div>
              <div className="c-profile-page-detail-value">{user.email}</div>
            </div>
            {user.createdAt && (
              <div className="c-profile-page-detail-row">
                <div className="c-profile-page-detail-label">Member Since</div>
                <div className="c-profile-page-detail-value">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="c-profile-page-actions">
          <Link href="/" className="c-profile-page-back-btn">
            ← Back to Home
          </Link>
          <button className="c-profile-page-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
