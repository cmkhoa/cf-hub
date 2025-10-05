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

  const imgSrc = (url) => {
    if (!url) return PLACEHOLDER;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return url.startsWith("/") ? url : `/uploads/${url}`;
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
        const items = webinars.length ? webinars : Array.from({ length: 0 });
        const needsCarousel = items.length > slidesToShow;
        const renderCard = (webinar, index) => (
          <div key={index} className="carousel-slide">
            <Card hoverable className="mentor-card horizontal">
              <div className="mentor-image-container horizontal">
                <Image
                  src={imgSrc(webinar.image)}
                  alt={webinar.title}
                  width={260}
                  height={160}
                  className="mentor-image horizontal"
                />
              </div>
              <div className="mentor-text-side">
                <Meta
                  title={webinar.title}
                  description={
                    <div>
                      <div className="mentor-company">
                        {webinar.speakerName}
                        {webinar.speakerTitle
                          ? ` — ${webinar.speakerTitle}`
                          : ""}
                      </div>
                      <div className="mentor-position">
                        {webinar.description}
                      </div>
                      <div className="mentor-location">
                        {webinar.date
                          ? new Date(webinar.date).toLocaleDateString()
                          : ""}
                      </div>
                    </div>
                  }
                  className="mentor-meta"
                />
              </div>
            </Card>
          </div>
        );
        if (!needsCarousel) {
          return <div className="webinar-list">{items.map(renderCard)}</div>;
        }
        return (
          <Carousel
            arrows
            dots={false}
            infinite
            slidesToShow={slidesToShow}
            slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1200,
                settings: { slidesToShow: Math.min(3, items.length) },
              },
              {
                breakpoint: 992,
                settings: { slidesToShow: Math.min(2, items.length) },
              },
              { breakpoint: 768, settings: { slidesToShow: 1 } },
            ]}
          >
            {items.map(renderCard)}
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
