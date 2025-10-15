// frontend/src/pages/JobAndNewsPage.jsx
import React from "react";
import JobAndNews from "../components/JobAndNews/JobAndNews";

// Previously you imported many local images. With the new dynamic backend-driven approach
// you can either leave those imports or pass a small fallback array. For now we pass none.
const JobNewsPage = () => {
  return (
    <div>
      <JobAndNews />
    </div>
  );
};

export default JobNewsPage;
