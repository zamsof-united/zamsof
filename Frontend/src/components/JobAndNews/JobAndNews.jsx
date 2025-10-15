import React, { useEffect, useState } from "react";
import "./JobAndNews.css";

const JobAndNews = () => {
  const [jobNews, setJobNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Backend URL
  const API_BASE = import.meta.env.VITE_API_BASE || "https://zamsof.onrender.com/api";

  useEffect(() => {
    const fetchJobNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/jobnews`);
        if (!res.ok) throw new Error("Failed to fetch job & news data");
        const data = await res.json();
        setJobNews(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load updates right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobNews();
  }, [API_BASE]);

  const jobs = jobNews.filter((item) => item.type === "job");
  const news = jobNews.filter((item) => item.type === "news");

  return (
    <section className="job-news-section">
      {loading && <p className="loading-text">Loading updates…</p>}
      {error && <p className="error-text">{error}</p>}

      {/* ===== JOB POSTINGS ===== */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <article className="job-posting" key={job._id}>
            <h2>{job.title}</h2>
            {job.location && <p><strong>Location:</strong> {job.location}</p>}
            {job.deadline && <p><strong>Deadline:</strong> {job.deadline}</p>}
            <div
              className="job-desc"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
            <a
              href={job.link || "mailto:zamsof.forum@gmail.com?subject=Application"}
              className="apply-btn"
            >
              Apply Now
            </a>

            {/* Multiple Images for jobs */}
            {job.images && job.images.length > 0 && (
              <div className="job-images-container">
                {job.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_BASE.replace("/api", "")}${img}`}
                    alt={job.title}
                    className="job-news-image"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ))}
              </div>
            )}
          </article>
        ))
      ) : (
        !loading && <p className="no-jobs">No current job openings.</p>
      )}

      {/* ===== NEWS / UPDATES ===== */}
      <div className="news-updates">
        <h2>News & Updates</h2>
        {news.length === 0 && !loading && <p className="no-news">No news at the moment.</p>}

        <div className="news-grid">
          {news.map((n) => (
            <div className="news-card" key={n._id}>
              <div className="news-content">
                <h4>{n.title}</h4>
                <div
                  className="news-desc"
                  dangerouslySetInnerHTML={{ __html: n.description }}
                />
                {n.link && (
                  <p>
                    <a
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-link"
                    >
                      Read more
                    </a>
                  </p>
                )}
              </div>

              {/* Card for multiple images */}
              {n.images && n.images.length > 0 && (
                <div className="news-images-card">
                  {n.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${API_BASE.replace("/api", "")}${img}`}
                      alt={n.title}
                      className="news-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobAndNews;
