"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/contexts/langprov";
import "./OfflineEvents.css";

const OfflineEvents = () => {
  const { t } = useLang();
  const slides = [
    {
      id: 1,
      src: "/assets/offline-event1.png",
      alt: "Offline Event 1",
    },
    {
      id: 2,
      src: "/assets/offline-event2.png",
      alt: "Offline Event 2",
    },
    {
      id: 3,
      src: "/assets/offline-event3.png",
      alt: "Offline Event 3",
    },
    {
      id: 4,
      src: "/assets/offline-event4.png",
      alt: "Offline Event 4",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="offline-events-container">
      <div className="offline-events-header">
        <h2>{t("offlineEvents.title")}</h2>
      </div>

      <div className="offline-slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`offline-slide ${
              index === currentSlide ? "active" : ""
            }`}
          >
            <div className="offline-image-wrapper">
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

      <div className="offline-dots-container">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`offline-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default OfflineEvents;
