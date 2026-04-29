import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          {user ? (
            <>
              <div className="profile-avatar">{user.fullName?.[0]?.toUpperCase() || "U"}</div>
              <h1 className="profile-title">Your Profile</h1>
              <p className="profile-subtitle">
                Welcome back to Clay in a Tray.
              </p>

              <div className="profile-details">
                <div className="profile-detail">
                  <span className="profile-label">Full Name</span>
                  <strong>{user.fullName || "Guest User"}</strong>
                </div>

                <div className="profile-detail">
                  <span className="profile-label">Email</span>
                  <strong>{user.email}</strong>
                </div>

                <div className="profile-detail">
                  <span className="profile-label">Marketing Updates</span>
                  <strong>{user.marketing ? "Subscribed" : "Not subscribed"}</strong>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-secondary" onClick={() => navigate("/")}>
                  Back to Home
                </button>
                <button className="btn-primary" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="profile-title">Profile</h1>
              <p className="profile-subtitle">
                You are not logged in yet. Please sign in to view your account details.
              </p>
              <div className="profile-actions profile-actions--center">
                <button className="btn-primary" onClick={() => navigate("/login")}>
                  Go to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
