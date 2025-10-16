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
  }, []);

  const jobs = jobNews.filter((item) => item.type === "job");
  const news = jobNews.filter((item) => item.type === "news");

  return (
    <section className="job-news-section">
      {loading && <p className="loading-text">Loading updates…</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Job Postings */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <article key={job._id} className="job-posting">
            <h2>{job.title}</h2>
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
              <div className="job-images-container">
                {job.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${API_BASE.replace("/api", "")}${img}`}
                    alt={job.title}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ))}
              </div>
            )}
          </article>
        ))
      ) : (
        !loading && <p className="no-jobs">No current job openings.</p>
      )}

      {/* News & Updates */}
      <div className="news-updates">
        <h2>News & Updates</h2>
        {news.length === 0 && !loading && <p>No news at the moment.</p>}
        <div className="news-grid">
          {news.map((n) => (
            <div key={n._id} className="news-card">
              <div className="news-content">
                <h4>{n.title}</h4>
                <div dangerouslySetInnerHTML={{ __html: n.description }} />
                {n.link && (
                  <p>
                    <a href={n.link} target="_blank" rel="noopener noreferrer">
                      Read more
                    </a>
                  </p>
                )}
              </div>
              {n.images && n.images.length > 0 && (
                <div className="news-images-card">
                  {n.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${API_BASE.replace("/api", "")}${img}`}
                      alt={n.title}
                      onError={(e) => (e.target.style.display = "none")}
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
