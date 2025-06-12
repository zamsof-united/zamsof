
import SwiperCore from 'swiper/core'; // Import Swiper core
import 'swiper/css'; // Import Swiper core styles
 // Import Autoplay module styles
import { Autoplay } from 'swiper/modules'; // Import Autoplay module
import { Swiper, SwiperSlide } from 'swiper/react';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.png';
import img3 from '../../assets/img3.png';
import img4 from '../../assets/img4.png';
import img5 from '../../assets/img5.png';
import img6 from '../../assets/img6.jpeg';
import img8 from '../../assets/img8.jpg';
import img9 from '../../assets/img8.jpg';
import './Recognition.css'; // Import the provided CSS file

// Configure Swiper to use modules
SwiperCore.use([Autoplay]);

const Recognition = () => {
  const createSlide = (image) => (
    <SwiperSlide key={image}>
      <div className="partner">
        <img src={image} alt="partner" />
      </div>
    </SwiperSlide>
  );

  return (
    <>
      <div className="section-title">
        <h1 className="section-heading" style={{marginBottom:"6rem",marginTop:"4rem"}}>We Are Recognised & Trusted By</h1>
        
      </div>
      <div className="partnersRec">
        <Swiper
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          slidesPerView={1}
          spaceBetween={10}
          breakpoints={{
            525: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 25 },
            768: { slidesPerView: 3, spaceBetween: 40 },
            1024: { slidesPerView: 3, spaceBetween: 50 }
          }}
          slideToClickedSlide={true}
          loop={true}
          loopFillGroupWithBlank= {true}
          //TODO Add Action in Zambia, PCFS, Eco Fish, and other key partners.
          className="swipeflex"
        >
          {[img1, img2, img3, img4, img5, img6, img8].map((image) => createSlide(image))}
        </Swiper>
      </div>
    </>
  );
};

export default Recognition;
