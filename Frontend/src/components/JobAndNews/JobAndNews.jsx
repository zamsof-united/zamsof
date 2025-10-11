import React from "react";
import "./JobAndNews.css";

const JobAndNews = ({ newsImages }) => {
  return (
    <section className="job-news-section">
      {/* ===== JOB POSTING ===== */}
      <div className="job-posting">
        <h2> Global South Opportunities</h2>
        <h3>WE ARE HIRING!</h3>
        <p><strong>Resource Mobilization Officers (RMOs) x 2</strong></p>
        <p>
          Work Remotely or In-Person.<br/>
          Lusaka, Zambia<br/>
          Reporting to: The National Coordinator
        </p>
        <p>
          <strong>Duration:</strong> Flexible<br/>
          <strong>Application Deadline:</strong> October 31, 2025<br/>
          <strong>Start Date:</strong> As soon as possible
        </p>

        <p>
          ZAMSOF is looking for 2 Remote Resource Mobilization Officers to
          support the organization’s fundraising, grants application, management,
          and donor engagement efforts.
        </p>

        <h4>Required Qualifications</h4>
        <ul>
          <li>Bachelor/Master in Dev Studies, Intl Relations, Business Admin or related.</li>
          <li>2-5 years experience in resource mobilization, grant writing, donor relations.</li>
          <li>Clear, result-oriented proposal writing skills.</li>
          <li>Strong organizational and interpersonal skills.</li>
          <li>Microsoft Office knowledge; donor database experience is a plus.</li>
        </ul>

        <h4>Key Responsibilities</h4>
        <ul>
          <li>Proposal development and grant writing.</li>
          <li>Fundraising strategies and pipeline management.</li>
          <li>Donor engagements and administration.</li>
          <li>Reporting and documentation.</li>
        </ul>

        <h4>Application Procedure</h4>
        <p>
          Submit your application via the link addressed to The National Coordinator:
        </p>
        <ul>
          <li>Cover letter outlining interest and qualifications.</li>
          <li>CV / Resume</li>
        </ul>
        <p>Send by October 31, 2025. Only shortlisted candidates will be contacted.</p>

        <h4>Why Join ZAMSOF</h4>
        <ul>
          <li>Contribute to Zambia’s social movement and advocacy.</li>
          <li>Lived experience learning about civil society in Global South.</li>
          <li>Networking and coalition building opportunities.</li>
        </ul>

        <p>Contract is voluntary; remuneration may apply based on donor funding.</p>
      </div>

      {/* ===== NEWS / MEDIA ===== */}
      <div className="news-updates">
        <h2> News & Updates</h2>
        <div className="news-item">
          <h4>Ubuntu in Action</h4>
          <p>
            Media coverage:{" "}
            <a href="https://the-global-forest-coalition.shorthandstories.com/ubuntu-in-action/index.html" target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </p>
        </div>

        <div className="news-images">
          {newsImages && newsImages.map((img, idx) => (
            <img key={idx} src={img} alt={`ZAMSOF news ${idx+1}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobAndNews;


