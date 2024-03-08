import React, { useEffect } from "react";
import Hero from "../Components/hero";
import Hero2 from "../Components/hero2";
import SlideShow from "../Components/SlideShow";
import MiddleQuote from "../Components/MiddleQuote";
import Wave from "../Assets/svgs/waves";

export default function Home() {
  useEffect(() => {
    document.querySelector(".home-nav-item").style.borderBottom =
      "2px solid #182d09";
  }, []);

  return (
    <div className="Home-Page">
      <div className="hero-container">
        <Hero />
      </div>
      <Wave variant="top" />
      <div className="hero2-container">
        <Hero2 />
      </div>
      <Wave variant="bottom" />
      <div className="slideshow-container">
        {/* <SlideShow /> */}
      </div>
      <style jsx>
        {`
          .slideshow-container {
            margin: 0 100px 100px;
          }
          .hero2-container {
            displey: flex;
            justify-content: center;
            width: 100%;
          }
          @media screen and (max-width: 768px) {
            .slideshow-container {
              margin: 0 50px 50px;
            }
          }
        `}
      </style>
    </div>
  );
}
