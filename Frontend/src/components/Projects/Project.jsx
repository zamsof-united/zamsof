import { useState, useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { FaCalendarAlt, FaGlobe, FaMapPin, FaUsers } from 'react-icons/fa';
import './Project.css';
import { projectData } from '../../Data/Project';

// ProjectCard Component
const ProjectCard = ({ project }) => {
  if (!project) return null; // Handle missing project props safely

  return (
    <div className="project-card">
      <h3 className="project-title">{project.title}</h3>
      <div className="project-meta">
        <div className="meta-item">
          <FaCalendarAlt size={18} />
          <span>{project.duration}</span>
        </div>
        <div className="meta-item">
          <FaMapPin size={18} />
          <span>{project.location}</span>
        </div>
        <div className="meta-item">
          <FaUsers size={18} />
          <span>{project.donor}</span>
        </div>
      </div>
      <p className="project-summary">{project.summary}</p>
    </div>
  );
};

// PropTypes for ProjectCard
ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    donor: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
  }),
};

// ProjectsGrid Component
const ProjectsGrid = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered projects based on search term
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower) ||
        project.donor.toLowerCase().includes(searchLower)
      );
    });
  }, [projects, searchTerm]);

  return (
    <div className="projects-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="search-input"
        />
      </div>
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))
        ) : (
          <p>No projects found</p> // No results message
        )}
      </div>
    </div>
  );
};

// PropTypes for ProjectsGrid
ProjectsGrid.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      donor: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Main Project Component
const Project = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <FaGlobe className="global-icon" />
            <h1 className="title-text">Our Impact Projects</h1>
          </div>
        </div>
      </header>
      <main>
        <ProjectsGrid projects={projectData} />
      </main>
    </div>
  );
};

export default Project;
