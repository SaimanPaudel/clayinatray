import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch {
      return null;
    }
  }, []);

  // Initialize edit data when entering edit mode
  const handleEditClick = () => {
    setEditData({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited profile
  const handleSaveProfile = () => {
    if (!editData.fullName.trim() || !editData.email.trim()) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setError("Please enter a valid email");
      return;
    }

    const updatedUser = {
      ...user,
      fullName: editData.fullName,
      email: editData.email,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setSuccess("Profile updated successfully!");
    setIsEditing(false);
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All password fields are required");
      return;
    }

    if (passwordData.currentPassword !== user?.password) {
      setError("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const updatedUser = {
      ...user,
      password: passwordData.newPassword,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setSuccess("Password changed successfully!");
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setError("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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

              {/* Success Message */}
              {success && (
                <div className="alert alert-success">
                  ✓ {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-error">
                  ✕ {error}
                </div>
              )}

              {/* Edit Profile Mode */}
              {isEditing ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editData.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="profile-actions">
                    <button className="btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : isChangingPassword ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="profile-actions">
                    <button className="btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handlePasswordChange}>
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                    <button className="btn-primary" onClick={handleEditClick}>
                      Edit Profile
                    </button>
                  </div>

                  <div className="profile-actions profile-actions--secondary">
                    <button className="btn-text" onClick={() => setIsChangingPassword(true)}>
                      Change Password
                    </button>
                    <button className="btn-danger" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                </>
              )}
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
