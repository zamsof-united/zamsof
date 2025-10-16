import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Admin.css";

//const BACKEND_URL = "http://localhost:5000"; // Update for production
//const BACKEND_URL = "https://zamsof.onrender.com"; // ✅ correct for production
const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://zamsof.onrender.com";


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

  const menuItems = [
    { name: "Job & News", path: "jobnews" },
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

  // Load token
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
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
      const res = await fetch(`${BACKEND_URL}/api/verify-password`, {
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
      } else setPasswordError(result.message || "Incorrect password");
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
      const res = await fetch(`${BACKEND_URL}/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setData(data.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  // Submit Job/News with multiple images
  const handleSubmitJobNews = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((img) => form.append("images", img)); // matches backend
        } else {
          form.append(key, formData[key]);
        }
      });

      const res = await fetch(`${BACKEND_URL}/api/jobnews`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Unexpected response: " + text);
      }

      const result = await res.json();
      setData([result, ...data]);
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

      alert("Successfully added!");
    } catch (err) {
      console.error(err);
      setFormError(err.message);
    }
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
                  className={`sidebar-link ${activeLink === item.path ? "active" : ""}`}
                  onClick={() => {
                    setEndpoint(item.path);
                    setActiveLink(item.path);
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
                <h3>Add Job or News</h3>
                <form onSubmit={handleSubmitJobNews} className="add-form">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="job">Job</option>
                    <option value="news">News</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Deadline (optional)"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Start Date (optional)"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Contract Info (optional)"
                    value={formData.contract}
                    onChange={(e) => setFormData({ ...formData, contract: e.target.value })}
                  />

                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    placeholder="Description"
                  />
                  <ReactQuill
                    theme="snow"
                    value={formData.qualifications}
                    onChange={(value) => setFormData({ ...formData, qualifications: value })}
                    placeholder="Qualifications (HTML list)"
                  />
                  <ReactQuill
                    theme="snow"
                    value={formData.responsibilities}
                    onChange={(value) => setFormData({ ...formData, responsibilities: value })}
                    placeholder="Responsibilities (HTML list)"
                  />

                  <input
                    type="text"
                    placeholder="Application / Read More Link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, images: Array.from(e.target.files) })
                    }
                  />

                  <button type="submit" className="submit-btn">
                    Add {formData.type === "job" ? "Job" : "News"}
                  </button>
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
                    <p>Type: {item.type}</p>
                    <p>Location: {item.location}</p>
                    <p>Deadline: {item.deadline}</p>
                    <p>Link: {item.link}</p>
                    <button onClick={() => handleDelete(item._id)} className="delete-btn">
                      Delete
                    </button>
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







