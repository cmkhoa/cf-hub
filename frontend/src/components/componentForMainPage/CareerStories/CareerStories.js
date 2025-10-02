import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin, Button } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { MoreOutlined } from "@ant-design/icons";
import "./CareerStories.css";
import { API_ENDPOINTS } from "@/config/api";

const { Title, Text: AntText } = Typography;

const CareerStories = () => {
  const [loading, setLoading] = useState(false);
  const [byCategory, setByCategory] = useState({
    "resume-tips": [],
    "interview-tips": [],
    "technical-tips": [],
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const cats = ["resume-tips", "interview-tips", "technical-tips"];
        const requests = cats.map((slug) =>
          fetch(
            `${
              API_ENDPOINTS.blog.posts
            }?status=published&postType=success&limit=1&category=${encodeURIComponent(
              slug
            )}`
          )
            .then((r) => (r.ok ? r.json() : Promise.resolve({ items: [] })))
            .catch(() => ({ items: [] }))
        );
        const results = await Promise.all(requests);
        if (!cancelled) {
          setByCategory({
            "resume-tips": results[0]?.items || [],
            "interview-tips": results[1]?.items || [],
            "technical-tips": results[2]?.items || [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Load career stories failed", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryColumns = [
    {
      title: "Resume Tips",
      slug: "resume-tips",
      stories: byCategory["resume-tips"],
    },
    {
      title: "Interview Tips",
      slug: "interview-tips",
      stories: byCategory["interview-tips"],
    },
    {
      title: "Technical Tips",
      slug: "technical-tips",
      stories: byCategory["technical-tips"],
    },
  ];

  return (
    <section className="success-story-section">
      <div className="container">
        <div className="success-story-header">
          <Title level={2} className="success-story-title">
            Career Stories
          </Title>
          <p className="success-story-subtitle">
            Real journeys, real results. See how CF Hub members landed their
            dream jobs and overcame career challenges.
          </p>
        </div>
        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        )}
        {!loading && (
          <>
            <Row gutter={[24, 24]}>
              {categoryColumns.map((column, i) => (
                <Col xs={24} md={8} key={i}>
                  <div className="category-column">
                    <div className="category-header">
                      <Title level={4} className="category-title">
                        {column.title}
                      </Title>
                      <MoreOutlined
                        className="more-icon"
                        onClick={() => {
                          window.location.href = `/blog?category=${encodeURIComponent(
                            column.slug
                          )}`;
                        }}
                      />
                    </div>
                    <div className="posts-container redesigned">
                      {column.stories && column.stories.length > 0 ? (
                        (() => {
                          const story = column.stories[0];
                          return (
                            <Card
                              key={story._id}
                              className={`post-card small-card ${
                                story.featured ? "featured-post" : "regular-post"
                              }`}
                              cover={
                                <div
                                  className="post-image-container small-image"
                                  onClick={() =>
                                    (window.location.href = `/stories/${story.slug}`)
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    src={
                                      story.coverImageData
                                        ? `${API_ENDPOINTS.blog.posts}/${story._id}/cover`
                                        : "/assets/blank-profile-picture.jpg"
                                    }
                                    alt={story.title}
                                    className="post-image"
                                  />
                                </div>
                              }
                              onClick={() =>
                                (window.location.href = `/stories/${story.slug}`)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="post-content small-content">
                                <Title
                                  level={4}
                                  className="post-title small-title"
                                >
                                  {story.title}
                                </Title>
                                <div className="post-meta small-meta">
                                  {story.author?.name && (
                                    <AntText className="author">
                                      BY {story.author.name.toUpperCase()}
                                    </AntText>
                                  )}
                                  <div className="meta-dot"></div>
                                  <AntText className="date">
                                    {story.publishedAt
                                      ? new Date(
                                          story.publishedAt
                                        ).toLocaleDateString()
                                      : ""}
                                  </AntText>
                                </div>
                                {story.excerpt && (
                                  <AntText className="post-excerpt small-excerpt">
                                    {story.excerpt}
                                  </AntText>
                                )}
                              </div>
                            </Card>
                          );
                        })()
                      ) : (
                        <div
                          className="no-posts"
                          style={{ color: "#777", fontSize: 12 }}
                        >
                          No posts yet
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="view-all-section" style={{ marginTop:32 }}>
              <Link href="/stories" legacyBehavior>
                <Button
                  type="primary"
                  size="large"
                  className="view-all-btn view-all-btn-stories"
                  icon={<ArrowRightOutlined />}
                >
                  View All Stories
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CareerStories;
