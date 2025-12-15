"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // Function to check and update user state
  const checkUser = useCallback(() => {
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
          setUser(null);
        }
      } catch (error) {
        console.error("Invalid JSON in localStorage → clearing user", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // Check user on mount
    checkUser();

    // Listen for storage changes (when user logs in/out in another tab or window)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkUser();
      }
    };

    // Listen for custom event (when user logs in/out in same window)
    const handleUserChange = () => {
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        checkUser();
      }, 100);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userStateChange", handleUserChange);

    // Also check when pathname changes (in case user navigates after login)
    // Add a small delay to ensure localStorage is ready
    const timeoutId = setTimeout(() => {
      checkUser();
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userStateChange", handleUserChange);
      clearTimeout(timeoutId);
    };
  }, [pathname, checkUser]);

  // Also check user state on focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      checkUser();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkUser]);

  // Get first letter of username
  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="c-navbar">
      <div className="c-navbar-container">
        {/* Logo */}
        <Link href="/" className="c-navbar-logo">
          BlogSpace
        </Link>

        {/* Hamburger Button */}
        <button
          className={`c-navbar-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        {/* Menu Links */}
        <ul className={`c-navbar-menu ${menuOpen ? "active" : ""} my-3`}>
          <li>
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" onClick={handleLinkClick}>
              About
            </Link>
          </li>

          <li>
            <Link href="/contact" onClick={handleLinkClick}>
              Contact
            </Link>
          </li>

          {!user ? (
            // Not logged in → Show Login
            <li>
              <Link href="/login" onClick={handleLinkClick}>
                Login
              </Link>
            </li>
          ) : (
            // Logged in → Show Profile Icon
            <>
              <li>
                <Link
                  href="/create-post"
                  className="c-create-post-btn"
                  onClick={handleLinkClick}
                >
                  Create Post
                </Link>
              </li>
              <li className="c-profile-container">
                <Link
                  href="/profile"
                  className="c-profile-icon"
                  onClick={handleLinkClick}
                  aria-label="User profile"
                >
                  {getInitial(user.username)}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
