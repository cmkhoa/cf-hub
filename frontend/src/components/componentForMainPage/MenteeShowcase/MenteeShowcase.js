"use client";
import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./MenteeShowcase.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_ENDPOINTS } from "@/config/api";

const { Title, Paragraph, Text: AntText } = Typography;
const { Meta } = Card;

const PLACEHOLDER = "/assets/blank-profile-picture.jpg";

const MenteeShowcase = () => {
  const router = useRouter();
  const [webinars, setWebinars] = useState([]);

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

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api";
  const imgSrc = (webinar) => {
    if (!webinar) return PLACEHOLDER;
    const u = webinar.image;
    if (!u) return PLACEHOLDER;
    if (/^https?:\/\//i.test(u)) return u;
    return `${apiBase}/webinars/${webinar._id || ""}/image`;
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

      <div className="webinar-grid">
        {webinars.map((webinar, index) => {
          const reg = webinar.registrationUrl;
          const rec = webinar.recordingUrl;
          const dateLabel = webinar.date
            ? new Date(webinar.date).toLocaleDateString()
            : null;

          return (
            <Card
              key={webinar._id || index}
              hoverable
              className="webinar-card"
              onClick={() => {
                if (reg) window.open(reg, "_blank", "noopener");
                else if (rec) window.open(rec, "_blank", "noopener");
              }}
            >
              <div className="webinar-image-container">
                <Image
                  src={imgSrc(webinar)}
                  alt={webinar.title}
                  width={400}
                  height={250}
                  className="webinar-image"
                  style={{ objectFit: "contain" }}
                  priority={index < 2}
                />
              </div>
              <div className="webinar-content">
                <Title level={4} className="webinar-title">
                  {webinar.title}
                </Title>
                <div className="webinar-speaker">
                  {webinar.speakerName}
                  {webinar.speakerTitle ? ` — ${webinar.speakerTitle}` : ""}
                </div>
                <Paragraph className="webinar-description">
                  {webinar.description}
                </Paragraph>
                {dateLabel && (
                  <div className="webinar-date">📅 {dateLabel}</div>
                )}
                <div className="webinar-actions">
                  {reg && (
                    <Button
                      type="primary"
                      size="small"
                      className="webinar-btn webinar-btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(reg, "_blank", "noopener");
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
                        window.open(rec, "_blank", "noopener");
                      }}
                    >
                      Watch
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="call-to-action">
        <Button
          type="primary"
          size="large"
          className="view-all-btn"
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
