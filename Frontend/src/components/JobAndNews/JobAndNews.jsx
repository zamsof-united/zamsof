import React, { useEffect, useState } from "react";
import "./JobAndNews.css";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://zamsof.onrender.com/api";

const JobAndNews = () => {
  const [jobNews, setJobNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobNews = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/jobnews`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      console.log("Fetched job/news:", data);
      setJobNews(data);
    } catch (err) {
      console.error("Fetch job/news error:", err);
      setError("Unable to load updates right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobNews();
  }, []);

  const jobs = jobNews.filter((item) => item.type === "job");
  const news = jobNews.filter((item) => item.type === "news");

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE.replace("/api", "")}${img}`;
  };

  return (
    <section className="job-news-section">
      <div className="section-header">
        <h2>Job & News Updates</h2>
        <button className="refresh-btn" onClick={fetchJobNews}>
          Refresh
        </button>
      </div>

      {loading && <p className="loading-text">Loading updates…</p>}
      {error && <p className="error-text">{error}</p>}

      {/* ===== Jobs ===== */}
      {jobs.length > 0 && (
        <div className="jobs-container">
          {jobs.map((job) => (
            <article key={job._id} className="job-card">
              <h3>{job.title}</h3>
              {job.location && <p><strong>Location:</strong> {job.location}</p>}
              {job.deadline && <p><strong>Deadline:</strong> {job.deadline}</p>}
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
              <a
                href={job.link || "mailto:zamsof.forum@gmail.com?subject=Application"}
                className="apply-btn"
              >
                Apply Now
              </a>
              {job.images && job.images.length > 0 && (
                <div className="images-container">
                  {job.images.map((img, i) => (
                    <img
                      key={i}
                      src={getImageSrc(img)}
                      alt={job.title}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {!loading && jobs.length === 0 && <p className="no-jobs">No current job openings.</p>}

      {/* ===== News ===== */}
      <div className="news-section">
        <h2>News & Updates</h2>
        {news.length === 0 && !loading && <p>No news at the moment.</p>}
        <div className="news-grid">
          {news.map((n) => (
            <div key={n._id} className="news-card">
              {n.images && n.images.length > 0 && (
                <div className="news-images">
                  {n.images.map((img, i) => (
                    <img
                      key={i}
                      src={getImageSrc(img)}
                      alt={n.title}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ))}
                </div>
              )}
              <div className="news-content">
                <h4>{n.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: n.description }} />
                {n.link && (
                  <a href={n.link} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobAndNews;
