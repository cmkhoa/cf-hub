"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/contexts/langprov";
import "./SuccessMetrics.css";

const SuccessMetrics = () => {
  const { t } = useLang();
  const slides = [
    {
      id: 1,
      src: "/assets/online-event1.png",
      alt: "Online Event 1",
    },
    {
      id: 2,
      src: "/assets/online-event2.png",
      alt: "Online Event 2",
    },
    {
      id: 3,
      src: "/assets/online-event3.png",
      alt: "Online Event 3",
    },
    {
      id: 4,
      src: "/assets/online-event4.png",
      alt: "Online Event 4",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="success-metrics-container">
      <div className="success-metrics-header">
        <h2>{t("onlineEvents.title")}</h2>
      </div>

      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`metric-slide ${index === currentSlide ? "active" : ""}`}
          >
            <div className="image-wrapper">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                style={{ objectFit: "contain" }}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default SuccessMetrics;
