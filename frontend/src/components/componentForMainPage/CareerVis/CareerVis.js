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
import './CareerVis.css';
import { useLang } from "@/contexts/langprov";

const { Title, Paragraph, Text } = Typography;

const JobApp = () => {
  const { t } = useLang();
  const [activePath, setActivePath] = useState('finance');
  const [compact, setCompact] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  const careerPaths = {
    finance: {
      title: "Finance & Banking",
      icon: <BankOutlined />,
      color: "#0C1E72",
      description: "Investment banking, corporate finance, risk management",
      skills: ["Financial Modeling", "Excel", "SQL", "Python", "CFA"],
      salary: "$85K - $150K",
      growth: 85,
      roadmap: [
        {
          level: "Foundations",
          description: "Accounting basics, time value of money, Excel fundamentals and corporate finance principles."
        },
        {
          level: "Financial Modeling",
          description: "Build DCF, LBO and merger models in Excel; learn sensitivity and scenario analysis."
        },
        {
          level: "Analytics & Tools",
          description: "Use SQL/Python for data analysis; become proficient with Bloomberg/Refinitiv terminals."
        },
        {
          level: "Transaction Experience",
          description: "Work on M&A, capital markets, due diligence and prepare client-facing materials."
        },
        {
          level: "Specialization & Credentials",
          description: "Pursue CFA/FRM or MBA depending on track; specialize in sectors like PE, asset management or corporate finance."
        },
        {
          level: "Senior Practitioner",
          description: "Lead deal teams, manage client relationships and take ownership of financial strategy."
        },
        {
          level: "Leadership",
          description: "Shape firm strategy, mentor senior staff and drive business development initiatives."
        }
      ]
    },
    consulting: {
      title: "Management Consulting",
      icon: <TeamOutlined />,
      color: "#f47458",
      description: "Strategy consulting, operations, business transformation",
      skills: ["Problem Solving", "PowerPoint", "Data Analysis", "Leadership", "MBA"],
      salary: "$90K - $180K",
      growth: 92,
      roadmap: [
        {
          level: "Foundations",
          description: "Develop structured problem solving, quantitative reasoning and case interview basics."
        },
        {
          level: "Analytical Toolkit",
          description: "Master Excel modeling, basic SQL and data visualization for client deliverables."
        },
        {
          level: "Client Execution",
          description: "Participate in workstreams: market sizing, process mapping, KPI definition and stakeholder workshops."
        },
        {
          level: "Specialization",
          description: "Choose industry or function focus (strategy, operations, digital) and deepen domain knowledge."
        },
        {
          level: "Consulting Skills",
          description: "Lead project modules, manage junior consultants and deliver executive presentations."
        },
        {
          level: "Network & Credentials",
          description: "Grow professional network, consider MBA or advanced credentials for acceleration."
        },
        {
          level: "Partner/Leadership",
          description: "Drive client portfolio, win new business and build firm-level capabilities."
        }
      ]
    },
    tech: {
      title: "Software Engineering Roles",
      icon: <BulbOutlined />,
      color: "#4b0082",
      description: "Software engineering, Product management, Data science",
      skills: ["Programming", "Cloud Computing","Database Design", "AI/ML", "Data Structure & Algorithms", "System Design"],
      salary: "$95K - $200K",
      growth: 88,
      roadmap: [
        {
          level: "Foundations",
          description: "Learn programming fundamentals; focus on one language, data structures, algorithms and Git basics."
        },
        {
          level: "Frontend Development",
          description: "Master HTML/CSS/JS and frameworks like React or Next.js; build interactive UIs."
        },
        {
          level: "Backend Development",
          description: "Build REST/GraphQL APIs, work with SQL/NoSQL databases and implement auth patterns."
        },
        {
          level: "Full Stack Projects",
          description: "Ship end-to-end apps, deploy to platforms (Vercel, Render) and add tests and CI workflows."
        },
        {
          level: "DevOps & Cloud",
          description: "Learn Docker, CI/CD (GitHub Actions), cloud fundamentals on AWS/GCP/Azure and monitoring."
        },
        {
          level: "Advanced Engineering",
          description: "Master system design, microservices, caching strategies and performance optimization."
        },
        {
          level: "Tech Leadership",
          description: "Lead architecture, mentor teams and influence product and engineering strategy."
        }
      ]
    },
    marketing: {
      title: "Marketing & Growth",
      icon: <GlobalOutlined />,
      color: "#27ae60",
      description: "Digital marketing, brand management, growth hacking",
      skills: ["Analytics", "SEO/SEM", "Social Media", "Content Strategy", "A/B Testing"],
      salary: "$70K - $130K",
      growth: 78,
      roadmap: [
        {
          level: "Foundations",
          description: "Understand marketing fundamentals: customer funnels, positioning, segmentation and basic analytics."
        },
        {
          level: "Digital Basics",
          description: "Learn SEO fundamentals, Google Analytics, tag management and basic HTML for marketers."
        },
        {
          level: "Acquisition Channels",
          description: "Run paid acquisition (Google Ads, Meta), set up tracking and optimize cost-per-acquisition."
        },
        {
          level: "Growth Experiments",
          description: "Design A/B tests, improve conversion rates and build retention loops using product analytics."
        },
        {
          level: "Content & Brand",
          description: "Develop content strategy, social media playbooks and long-term brand positioning."
        },
        {
          level: "Advanced Measurement",
          description: "Use SQL, BI tools and attribution modeling to guide channel investment decisions."
        },
        {
          level: "Marketing Leadership",
          description: "Lead growth teams, define GTM strategy and align marketing with product and sales goals."
        }
      ]
    }
  };

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
                      <Text className="growth-text">{path.growth}% growth</Text>
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
              {careerPaths[activePath].title} Roadmap
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
            <Title level={4} className="skills-title">Key Skills Required</Title>
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
              >
                {t("jobApp.cta.getStarted")}
              </Button>
              <Button 
                size="large" 
                className="secondary-cta"
                icon={<ArrowRightOutlined />}
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