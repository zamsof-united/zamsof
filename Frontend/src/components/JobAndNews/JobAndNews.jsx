import React, { useEffect, useState } from "react";
import "./JobAndNews.css";

// ✅ Import all 31 images from src/assets/news/
import img1 from "../../assets/news/1.jpg";
import img2 from "../../assets/news/2.jpg";
import img3 from "../../assets/news/3.jpg";
import img4 from "../../assets/news/4.jpg";
import img5 from "../../assets/news/5.jpg";
import img6 from "../../assets/news/6.jpg";
import img7 from "../../assets/news/7.jpg";
import img8 from "../../assets/news/8.jpg";
import img9 from "../../assets/news/9.jpg";
import img10 from "../../assets/news/10.jpg";
import img11 from "../../assets/news/11.jpg";
import img12 from "../../assets/news/12.jpg";
import img13 from "../../assets/news/13.jpg";
import img14 from "../../assets/news/14.jpg";
import img15 from "../../assets/news/15.jpg";
import img16 from "../../assets/news/16.jpg";
import img17 from "../../assets/news/17.jpg";
import img18 from "../../assets/news/18.jpg";
import img19 from "../../assets/news/19.jpg";
import img20 from "../../assets/news/20.jpg";
import img21 from "../../assets/news/21.jpg";
import img22 from "../../assets/news/22.jpg";
import img23 from "../../assets/news/23.jpg";
import img24 from "../../assets/news/24.jpg";
import img25 from "../../assets/news/25.jpg";
import img26 from "../../assets/news/26.jpg";
import img27 from "../../assets/news/27.jpg";
import img28 from "../../assets/news/28.jpg";
import img29 from "../../assets/news/29.jpg";
import img30 from "../../assets/news/30.jpg";
import img31 from "../../assets/news/31.jpg";

const newsImages = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30, img31
];

// ✅ API setup
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

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE.replace("/api", "")}${img}`;
  };

  return (
    <section className="job-news-section">
      {/* ===== Section Header ===== */}
      <div className="section-header">
         <h2>Job & News Updates</h2>
        <button className="refresh-btn" onClick={fetchJobNews}>
          Refresh
        </button>
      </div>

      {/* ===== Loading / Error ===== */}
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

      {/* ===== News Section (All 31 Images in One Card) ===== */}
      <div className="news-section">
        <h2>News & Updates</h2>
        <div className="single-news-card">
          <div className="news-images-grid">
            {newsImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`News ${index + 1}`}
                className="news-image"
              />
            ))}
          </div>

          <div className="news-content">
            <h3>Ubuntu in Action</h3>
            <p>
              Explore inspiring stories of collaboration and community empowerment
              from across the globe. These 31 snapshots capture the dedication and
              resilience of people taking action for sustainability and justice.
            </p>
            <a
              href="https://the-global-forest-coalition.shorthandstories.com/ubuntu-in-action/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-btn"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobAndNews;
