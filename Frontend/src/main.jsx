import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Thematic from "./Pages/Thematic.jsx";
import Project from "./components/Projects/Project.jsx";
import Admin from "./Admin/Admin.jsx";
import Newss from "./Pages/News.jsx";
import Gallery from "./Pages/Gallery.jsx";
import JobNewsPage from "./Pages/JobNewsPage.jsx"; // <-- New page import



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/news",
        element: <Newss />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/thematic",
        element: <Thematic />,
      },
      {
        path: "/projects",
        element: <Project />,
      },
      {
        path: "/admin-page",
        element: <Admin />,
      },
      {
        path: "/jobs",                  // <-- New route
        element: <JobNewsPage />,       // <-- Render Job & News Page
      },
      {
        path: "*",
        element: <h1>Page not found</h1>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);