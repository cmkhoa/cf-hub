"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Typography, Progress, Tag, Dropdown } from 'antd';
import { 
  RocketOutlined, 
  ArrowRightOutlined,
  BankOutlined,
  TeamOutlined,
  BulbOutlined,
  GlobalOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import './CareerVis.css';
import { useLang } from "@/contexts/langprov";

const { Title, Paragraph, Text } = Typography;

const JobApp = () => {
  const { t } = useLang();
  const router = useRouter();
  const [activePath, setActivePath] = useState('finance');
  const [compact, setCompact] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  const careerPaths = useMemo(() => ({
    finance: {
      title: t("jobApp.paths.finance.title"),
      icon: <BankOutlined />,
      color: "#0C1E72",
      description: t("jobApp.paths.finance.description"),
      skills: t("jobApp.paths.finance.skills"),
      salary: t("jobApp.paths.finance.salary"),
      growth: 85,
      roadmap: t("jobApp.paths.finance.roadmap")
    },
    consulting: {
      title: t("jobApp.paths.consulting.title"),
      icon: <TeamOutlined />,
      color: "#f47458",
      description: t("jobApp.paths.consulting.description"),
      skills: t("jobApp.paths.consulting.skills"),
      salary: t("jobApp.paths.consulting.salary"),
      growth: 92,
      roadmap: t("jobApp.paths.consulting.roadmap")
    },
    tech: {
      title: t("jobApp.paths.tech.title"),
      icon: <BulbOutlined />,
      color: "#4b0082",
      description: t("jobApp.paths.tech.description"),
      skills: t("jobApp.paths.tech.skills"),
      salary: t("jobApp.paths.tech.salary"),
      growth: 88,
      roadmap: t("jobApp.paths.tech.roadmap")
    },
    marketing: {
      title: t("jobApp.paths.marketing.title"),
      icon: <GlobalOutlined />,
      color: "#27ae60",
      description: t("jobApp.paths.marketing.description"),
      skills: t("jobApp.paths.marketing.skills"),
      salary: t("jobApp.paths.marketing.salary"),
      growth: 78,
      roadmap: t("jobApp.paths.marketing.roadmap")
    }
  }), [t]);

  // Switch to dropdown when viewport likely can't fit 4 cards comfortably
  const BREAKPOINT = 992; // match desktop CSS breakpoint
  useEffect(() => {
    const updateCompact = () => setCompact(window.innerWidth < BREAKPOINT);
    updateCompact();
    window.addEventListener('resize', updateCompact);
    return () => window.removeEventListener('resize', updateCompact);
  }, []);

  const dropdownItems = useMemo(() => {
    return Object.entries(careerPaths).map(([key, path]) => ({
      key,
      label: (
        <div className="cv-dropdown-card">
          <div className="cv-icon" style={{ color: path.color }}>
            {path.icon}
          </div>
          <div className="cv-body">
            <div className="cv-title-row">
              <span className="cv-title">{path.title}</span>
              <div className="cv-meta">
                <span className="cv-salary">{path.salary}</span>
                <div className="cv-growth">
                  <Progress percent={path.growth} size="small" showInfo={false} strokeColor={path.color} />
                  <span className="cv-growth-text">{path.growth}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }));
  }, [careerPaths]);

  return (
    <section className="career-path-visualizer">
      <div className="visualizer-container">
        {/* Header */}
        <div className="visualizer-header">
          <Title level={1} className="main-title">
            {t("jobApp.title")}
          </Title>
          <Paragraph className="main-subtitle">
            {t("jobApp.subtitle")}
          </Paragraph>
        </div>

        {/* Interactive Career Paths */}
        <div className="career-paths-section">
          <Title level={2} className="section-title">{t("jobApp.choosePath")}</Title>
          {compact ? (
            <div className="paths-dropdown">
              <Dropdown
                menu={{
                  items: dropdownItems,
                  onClick: ({ key }) => setActivePath(key)
                }}
                placement="bottom"
                trigger={["click"]}
              >
                <Button className="dropdown-trigger" size="large">
                  {careerPaths[activePath]?.title || t("jobApp.choosePath")} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          ) : (
            <div className="paths-grid">
              {Object.entries(careerPaths).map(([key, path]) => (
                <div
                  key={key}
                  className={`path-card ${activePath === key ? 'active' : ''}`}
                  onClick={() => setActivePath(key)}
                  onMouseEnter={() => setHoveredNode(key)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className="path-icon" style={{ color: path.color }}>
                    {path.icon}
                  </div>
                  <Title level={4} className="path-title">{path.title}</Title>
                  <Paragraph className="path-description">{path.description}</Paragraph>
                  <div className="path-metrics">
                    <div className="salary-range">{path.salary}</div>
                    <div className="growth-rate">
                      <Progress 
                        percent={path.growth} 
                        size="small" 
                        strokeColor={path.color}
                        showInfo={false}
                      />
                      <Text className="growth-text">{path.growth}% {t("jobApp.growth")}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Path Details */}
        <div className="path-details">
          <div className="details-header">
            <Title level={3} className="details-title">
              {careerPaths[activePath].title} {t("jobApp.roadmap")}
            </Title>
            <div className="path-timeline">
              {careerPaths[activePath].roadmap.map((milestone, index) => (
                <div key={index} className="timeline-milestone">
                  <div className="milestone-dot" style={{ backgroundColor: careerPaths[activePath].color }} />
                  <div className="milestone-content">
                    <Text className="milestone-level">{milestone.level}</Text>
                    <Text className="milestone-desc">{milestone.description}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="skills-section">
            <Title level={4} className="skills-title">{t("jobApp.keySkills")}</Title>
            <div className="skills-tags">
              {careerPaths[activePath].skills.map((skill, index) => (
                <Tag key={index} className="skill-tag" color={careerPaths[activePath].color}>
                  {skill}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="visualizer-cta">
          <div className="cta-content">
            <Title level={2} className="cta-title">
              {t("jobApp.cta.title")}
            </Title>
            <Paragraph className="cta-description">
              {t("jobApp.cta.description")}
            </Paragraph>
            <div className="cta-buttons">
              <Button 
                type="primary" 
                size="large" 
                className="primary-cta"
                icon={<RocketOutlined />}
                onClick={() => router.push('/chatroom')}
              >
                {t("jobApp.cta.getStarted")}
              </Button>
              <Button 
                size="large" 
                className="secondary-cta"
                icon={<ArrowRightOutlined />}
                onClick={() => router.push('/about')}
              >
                {t("jobApp.cta.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobApp;