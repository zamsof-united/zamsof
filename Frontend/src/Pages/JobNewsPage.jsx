import React from "react";
import JobAndNews from "../components/JobAndNews/JobAndNews";

// Import all 31 images for news
import img1 from "../assets/news/1.jpg";
import img2 from "../assets/news/2.jpg";
import img3 from "../assets/news/3.jpg";
import img4 from "../assets/news/4.jpg";
import img5 from "../assets/news/5.jpg";
import img6 from "../assets/news/6.jpg";
import img7 from "../assets/news/7.jpg";
import img8 from "../assets/news/8.jpg";
import img9 from "../assets/news/9.jpg";
import img10 from "../assets/news/10.jpg";
import img11 from "../assets/news/11.jpg";
import img12 from "../assets/news/12.jpg";
import img13 from "../assets/news/13.jpg";
import img14 from "../assets/news/14.jpg";
import img15 from "../assets/news/15.jpg";
import img16 from "../assets/news/16.jpg";
import img17 from "../assets/news/17.jpg";
import img18 from "../assets/news/18.jpg";
import img19 from "../assets/news/19.jpg";
import img20 from "../assets/news/20.jpg";
import img21 from "../assets/news/21.jpg";
import img22 from "../assets/news/22.jpg";
import img23 from "../assets/news/23.jpg";
import img24 from "../assets/news/24.jpg";
import img25 from "../assets/news/25.jpg";
import img26 from "../assets/news/26.jpg";
import img27 from "../assets/news/27.jpg";
import img28 from "../assets/news/28.jpg";
import img29 from "../assets/news/29.jpg";
import img30 from "../assets/news/30.jpg";
import img31 from "../assets/news/31.jpg";

// ... continue importing up to img31
const newsImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23, img24, img25, img26, img27, img28, img29, img30, img31 /* ... add all 31 images */];

const JobNewsPage = () => {
  return (
    <div>
      <JobAndNews newsImages={newsImages} />
    </div>
  );
};

export default JobNewsPage;