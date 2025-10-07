"use client";

import React, { useEffect, useState } from "react";
import { Input, Button, Row, Col, Typography } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Link from "next/link";
// Using native <img> for small thumbnails to avoid Next/Image optimizer hitting backend multiple times (429)
import "./Footer.css";
import { API_ENDPOINTS } from "@/config/api";
import { useLang } from "@/contexts/langprov";

const { Title, Paragraph, Text: AntText } = Typography;

const Footer = () => {
  const { t } = useLang();
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement subscription logic
  };

  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchNews = async () => {
      try {
        setLoadingNews(true);
        const params = new URLSearchParams();
        params.set("limit", "3");
        params.set("postType", "blog");
        // public endpoint returns only published by default
        const res = await fetch(
          `${API_ENDPOINTS.blog.posts}?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to load news");
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setNews(items);
      } catch (e) {
        if (!cancelled) setNews([]);
      } finally {
        if (!cancelled) setLoadingNews(false);
      }
    };
    fetchNews();
    return () => {
      cancelled = true;
    };
  }, []);

  const backendApiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api";

  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-top">
        <div className="container">
          <Row justify="space-between" align="middle">
            <Col>
              <AntText className="footer-top-text">
                {t("footer.aboutTitle")}
              </AntText>
            </Col>
            <Col>
              <AntText className="footer-top-text">{t("footer.recentNews")}</AntText>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <Row gutter={[48, 48]}>
            {/* Brand Section */}
            <Col xs={24} md={12} lg={12}>
              <div className="brand-section">
                <div className="brand-logo single">
                  <img
                    src="/assets/logo.png"
                    alt="Site Logo"
                    className="footer-logo-img"
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <Paragraph className="brand-description">
                  {/* CF Hub là tổ chức phi lợi nhuận 501(c)(3) được thành lập bởi các bạn trẻ 
									sinh viên và chuyên gia người Việt tại Mỹ, nhằm trở thành nền tảng cộng đồng 
									hỗ trợ sinh viên và các bạn trẻ trong quá trình chuyển đổi từ môi trường học 
									thuật sang môi trường chuyên nghiệp, giúp các bạn kết nối và phát triển. */}
                  {t("footer.aboutBody1")}
                </Paragraph>
                <Paragraph
                  className="brand-description"
                  style={{ marginTop: 8 }}
                >
                  {t("footer.aboutBody2")}
                </Paragraph>
                <Title level={5} className="follow-title">
                  {t("footer.followUs")}
                </Title>
                <div className="social-links">
                  <a
                    href="https://www.facebook.com/CareerFoundationHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Facebook page"
                  >
                    <Button
                      type="text"
                      icon={<FacebookOutlined />}
                      className="social-btn facebook always"
                    />
                  </a>
                  {/* <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our LinkedIn page"
                  >
                    <Button
                      type="text"
                      icon={<LinkedinOutlined />}
                      className="social-btn linkedin always"
                    />
                  </a> */}
                  <a
                    href="https://www.instagram.com/cf.hub_2025/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Instagram profile"
                  >
                    <Button
                      type="text"
                      icon={<InstagramOutlined />}
                      className="social-btn instagram always"
                    />
                  </a>
                  {/* <a
                    href="https://www.youtube.com/@sample-channel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our YouTube channel"
                  >
                    <Button
                      type="text"
                      icon={<YoutubeOutlined />}
                      className="social-btn youtube always"
                    />
                  </a> */}
                </div>
              </div>
            </Col>

            {/* Categories and Tags removed */}

            {/* Recent News */}
            <Col xs={24} md={12} lg={12}>
              <div className="news-section">
                <Title level={5} className="links-title">
                  {t("footer.recentNews")}
                </Title>
                <div className="news-list">
                  {news.length === 0 && !loadingNews && (
                    <div className="news-item">
                      <div className="news-content">
                        <div className="news-title">{t("footer.noRecent")}</div>
                      </div>
                    </div>
                  )}
                  {news.map((post) => {
                    const coverUrl = `${backendApiBase}/blog/posts/${post._id}/cover`;
                    const date = post.publishedAt || post.createdAt;
                    const formatted = date
                      ? new Date(date)
                          .toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })
                          .toUpperCase()
                      : "";
                    return (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="news-item"
                        prefetch={false}
                      >
                        <div className="news-image">
                          <img
                            src={coverUrl}
                            alt={post.title}
                            width={60}
                            height={40}
                            className="news-img"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/reference_image_1.jpg";
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </div>
                        <div className="news-content">
                          <div className="news-title">{post.title}</div>
                          <div className="news-date">{formatted}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <Row justify="center" align="middle">
            <Col>
              <Paragraph className="copyright">
                {t("footer.copyright")}
              </Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
