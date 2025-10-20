import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Admin.css";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://zamsof.onrender.com/api";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [endpoint, setEndpoint] = useState("jobnews");
  const [activeLink, setActiveLink] = useState("jobnews");
  const [editingItem, setEditingItem] = useState(null);

  const menuItems = [
    { name: "Job Management", path: "jobnews" },
    { name: "Donation", path: "donation" },
    { name: "Volunteer", path: "volunteer" },
    { name: "Partner", path: "partner" },
    { name: "Contact Us", path: "contact" },
    { name: "Join Us", path: "joinus" },
  ];

  const [formData, setFormData] = useState({
    type: "job",
    title: "",
    description: "",
    location: "",
    deadline: "",
    startDate: "",
    contract: "",
    qualifications: "",
    responsibilities: "",
    link: "",
    images: [],
  });

  const capitalizeWords = (str) =>
    str
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Load saved token
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch data from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, isAuthenticated, token]);

  // Admin login
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await res.json();
      if (result.success) {
        setToken(result.token);
        localStorage.setItem("adminToken", result.token);
        setIsAuthenticated(true);
        setPasswordError("");
      } else {
        setPasswordError(result.message || "Incorrect password");
      }
    } catch (err) {
      console.error(err);
      setPasswordError("Could not connect to backend");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setIsAuthenticated(false);
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item. Make sure backend is running and reachable.");
    }
  };

  // Add / Edit Job
  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((img) => {
            if (img instanceof File) form.append("images", img);
          });
        } else {
          form.append(key, formData[key] || "");
        }
      });

      const url = editingItem
        ? `${API_BASE}/jobnews/${editingItem._id}`
        : `${API_BASE}/jobnews`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Unknown server error");

      if (editingItem) {
        setData(data.map((item) => (item._id === result._id ? result : item)));
        setEditingItem(null);
        alert("Job updated successfully!");
      } else {
        setData([result, ...data]);
        alert("Job added successfully!");
      }

      // Reset form
      setFormData({
        type: "job",
        title: "",
        description: "",
        location: "",
        deadline: "",
        startDate: "",
        contract: "",
        qualifications: "",
        responsibilities: "",
        link: "",
        images: [],
      });
    } catch (err) {
      console.error("Submit Job Error:", err);
      setFormError(err.message);
    }
  };

  // Edit existing job
  const handleEdit = (item) => {
    setFormData({
      type: item.type,
      title: item.title || "",
      description: item.description || "",
      location: item.location || "",
      deadline: item.deadline || "",
      startDate: item.startDate || "",
      contract: item.contract || "",
      qualifications: item.qualifications || "",
      responsibilities: item.responsibilities || "",
      link: item.link || "",
      images: item.images || [],
    });
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-container">
      {!isAuthenticated ? (
        <div className="password-container">
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <h2>Admin Login</h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" className="password-submit-btn">
              Login
            </button>
            {passwordError && <p className="error-message">{passwordError}</p>}
          </form>
        </div>
      ) : (
        <>
          <aside className="sidebar">
            <h2>Admin Panel</h2>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            <nav>
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  className={`sidebar-link ${
                    activeLink === item.path ? "active" : ""
                  }`}
                  onClick={() => {
                    setEndpoint(item.path);
                    setActiveLink(item.path);
                    setEditingItem(null);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </aside>

          <main className="admin-main">
            <h2>{capitalizeWords(endpoint)} Management</h2>

            {endpoint === "jobnews" && (
              <div className="form-container">
                <h3>{editingItem ? "Edit Job" : "Add Job"}</h3>

                <form onSubmit={handleSubmitJob} className="add-form">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Deadline"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Contract Terms (optional)"
                    value={formData.contract}
                    onChange={(e) =>
                      setFormData({ ...formData, contract: e.target.value })
                    }
                  />

                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    placeholder="Full Job Description"
                  />
                  <ReactQuill
                    theme="snow"
                    value={formData.qualifications}
                    onChange={(value) =>
                      setFormData({ ...formData, qualifications: value })
                    }
                    placeholder="Required Qualifications"
                  />
                  <ReactQuill
                    theme="snow"
                    value={formData.responsibilities}
                    onChange={(value) =>
                      setFormData({ ...formData, responsibilities: value })
                    }
                    placeholder="Key Responsibilities"
                  />
                  <input
                    type="text"
                    placeholder="Application / Email Link"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                  />
                  <label style={{ fontWeight: "bold", marginTop: "8px" }}>
                    Upload Job Images (optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: [
                          ...formData.images.filter((i) => !(i instanceof File)),
                          ...Array.from(e.target.files),
                        ],
                      })
                    }
                  />

                  <button type="submit" className="submit-btn">
                    {editingItem ? "Update" : "Add"} Job
                  </button>

                  {editingItem && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setEditingItem(null);
                        setFormData({
                          type: "job",
                          title: "",
                          description: "",
                          location: "",
                          deadline: "",
                          startDate: "",
                          contract: "",
                          qualifications: "",
                          responsibilities: "",
                          link: "",
                          images: [],
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  {formError && <p className="error-message">{formError}</p>}
                </form>
              </div>
            )}

            {error && <p className="error-message">{error}</p>}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="data-container">
                {data.map((item) => (
                  <div key={item._id} className="data-card">
                    <h4>{item.title}</h4>
                    <p>Location: {item.location}</p>
                    <p>Deadline: {item.deadline}</p>
                    <p>Link: {item.link}</p>
                    <div className="btn-group">
                      <button onClick={() => handleEdit(item)} className="edit-btn">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Admin;
