"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Carousel, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./MenteeShowcase.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_ENDPOINTS } from "@/config/api";

const { Title, Text: AntText } = Typography;
const { Meta } = Card;

const PLACEHOLDER = "/assets/blank-profile-picture.jpg";

const MenteeShowcase = () => {
  const router = useRouter();
  const [webinars, setWebinars] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(API_ENDPOINTS.webinars.list, {
          next: { revalidate: 60 },
        });
        const data = await res.json();
        if (!ignore && Array.isArray(data)) setWebinars(data);
      } catch (err) {
        console.error("Failed to load webinars", err);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Measure container width to decide slidesToShow and whether carousel is needed
  useEffect(() => {
    const onResize = () => {
      const el = document.querySelector(
        ".mentor-showcase-container .carousel-measure"
      );
      const w = el
        ? el.clientWidth
        : typeof window !== "undefined"
        ? window.innerWidth
        : 0;
      setContainerWidth(w);
      if (w >= 1200) setSlidesToShow(4);
      else if (w >= 992) setSlidesToShow(3);
      else if (w >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';
  const imgSrc = (webinar) => {
    if (!webinar) return PLACEHOLDER;
    const u = webinar.image;
    if (!u) return PLACEHOLDER;
    if (/^https?:\/\//i.test(u)) return u;
    // For keys, use backend image proxy to stream/redirect
    return `${apiBase}/webinars/${webinar._id || ''}/image`;
  };
  return (
    <div className="mentor-showcase-container">
      <Title
        level={2}
        className="section-title"
        style={{
          fontWeight: 700,
          fontSize: 40,
          lineHeight: "65.35px",
          textAlign: "center",
        }}
      >
        Webinars & Workshops
      </Title>
      {/* <AntText className="sub-title">Software Engineer and Data</AntText> */}

      {/* element used to measure container width */}
      <div className="carousel-measure" style={{ width: "100%" }} />
      {(() => {
        const items = webinars.length ? webinars : [];
        const renderCard = (webinar, index) => {
          const reg = webinar.registrationUrl;
          const rec = webinar.recordingUrl;
          const primaryHref = reg || rec || null;
          const dateLabel = webinar.date ? new Date(webinar.date).toLocaleDateString() : null;
          const handleCardClick = () => {
            if (primaryHref) window.open(primaryHref, '_blank', 'noopener');
          };
          return (
            <div key={index} className="carousel-slide">
              <Card
                hoverable
                className="mentor-card horizontal card-clickable"
                onClick={handleCardClick}
              >
                <div className="mentor-image-container horizontal">
                  <Image
                    src={imgSrc(webinar)}
                    alt={webinar.title}
                    fill
                    className="mentor-image horizontal"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority={index < 2}
                  />
                  {dateLabel && <div className="image-badge">{dateLabel}</div>}
                </div>
                <div className="mentor-text-side">
                  <div className="webinar-title title-clamp">{webinar.title}</div>
                  <div className="mentor-company">
                    {webinar.speakerName}
                    {webinar.speakerTitle ? ` — ${webinar.speakerTitle}` : ""}
                  </div>
                  <div className="mentor-position desc-clamp">{webinar.description}</div>
                  <div className="webinar-actions">
                    {reg && (
                      <Button
                        type="primary"
                        size="small"
                        className="webinar-btn webinar-btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(reg, '_blank', 'noopener');
                        }}
                      >
                        Register
                      </Button>
                    )}
                    {rec && (
                      <Button
                        size="small"
                        className="webinar-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(rec, '_blank', 'noopener');
                        }}
                      >
                        Watch
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        };
        // Always show a one-row carousel; loop only when enough slides
        const loop = items.length > slidesToShow;
        return (
          <Carousel
            arrows
            dots={false}
            infinite={loop}
            slidesToShow={Math.min(slidesToShow, Math.max(items.length, 1))}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1200,
                settings: { slidesToShow: Math.min(3, Math.max(items.length, 1)) },
              },
              {
                breakpoint: 992,
                settings: { slidesToShow: Math.min(2, Math.max(items.length, 1)) },
              },
              { breakpoint: 768, settings: { slidesToShow: 1 } },
            ]}
          >
            {items.length ? items.map(renderCard) : <div />}
          </Carousel>
        );
      })()}

      <div className="call-to-action">
        <Button
          type="primary"
          size="large"
          className="view-all-btn view-all-btn-stories"
          icon={<ArrowRightOutlined />}
          onClick={() => router.push("/blog?category=webinars-workshops")}
        >
          See All Events
        </Button>
      </div>
    </div>
  );
};

export default MenteeShowcase;
