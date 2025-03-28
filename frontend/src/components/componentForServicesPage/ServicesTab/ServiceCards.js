import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import "./ServiceCards.css";

const { Title, Text } = Typography;

const services = [
  {
    title: "Internships/Research Finding for Freshman & Sophomore",
    description:
      "Our program helps freshmen and sophomores find internships and research opportunities in Software Engineering and Data. Participants will be thoroughly guided on how to prepare effective resumes, work on impactful technical projects for the community, practice interviews, and carefully refine essays for applications.",
    details: [
      "Analyze existing profiles (Resume, LinkedIn, GitHub, etc.) to identify strengths and weaknesses. Build compelling personal stories that highlight relevant skills, experience, and achievements.",
      "Attend 8 interactive sessions covering necessary skills and knowledge related to the field. Sessions may include technical training, interview preparation, and career orientation.",
      "Work in groups to complete a full technology project in the fields of Software Engineering or Data.",
    ],
    start: "Jan 2025",
    duration: "12 weeks",
    people: "5 - 10 mentees",
    fee: "Cost - Contact us",
  },
  {
    title: "Internships/New Grad Finding for Juniors & Seniors",
    description:
      "Our program assists juniors and seniors in finding internships and new grad opportunities in Software Engineering and Data. Participants will practice behavioral and technical interviews thoroughly, be grouped to practice LeetCode together, and receive continuous updates on internships, special programs, and resources tailored for specific companies.",
    details: [
      "Access all study and development materials, including session slides, recordings, reports, skill development courses, and interview practice resources.",
      "Internship Search Support: Continuously updated internship opportunities, special programs, and related updates through personal notifications, industry updates, and access to exclusive internship boards (6-8 times/week).",
      "Community Sharing & Support: Connect with other internship seekers via online forums and group chats to share experiences, learn from each other, and stay motivated.",
    ],
    start: "May 2025",
    duration: "12 weeks",
    people: "10 - 15 mentees",
    fee: "Cost - Contact us",
  },
  {
    title: "Investment Banking & Finance (Coming Soon)",
    description:
      "This program is planned for the near future. It will help participants search for jobs and apply to positions in Finance and Investment Banking.",
    details: [
      "Learn about the Finance and Investment Banking industry.",
      "Receive guidance on how to build a profile for applying to this field.",
      "Learn effective networking strategies in Finance to secure interviews.",
    ],
    start: "May 2025",
    duration: "6 weeks",
    people: "~5 mentees",
    fee: "Cost - Contact us",
  },
  {
    title: "Frequent Workshops and Fireside Chat with Professionals",
    description:
      "We regularly organize informal chats and sharing sessions with professionals in Software, Data, Machine Learning, AI, Finance, and Investment Banking.",
    details: [
      "Talk with individuals who have successfully secured internships and new grad jobs during recent challenging times.",
      "Hear about their current roles in trending fields like Software, Data, and Investment Banking.",
      "Share critical tips/tricks to increase the chances of successful applications for upcoming cycles.",
    ],
    start: "Feb 2025",
    duration: "1 session every 2 weeks",
    people: "Unlimited",
    fee: "Free",
  },
];

const ServiceCard = ({ service }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="service-card">
      <div className="service-header">
        <Title level={4}>{service.title}</Title>
        <Text>{service.description}</Text>
      </div>
      <div className="service-info">
        <div className="info-item">
          <CalendarOutlined className="icon" />
          <Text>{service.start}</Text>
        </div>
        <div className="info-item">
          <ClockCircleOutlined className="icon" />
          <Text>{service.duration}</Text>
        </div>
        <div className="info-item">
          <UsergroupAddOutlined className="icon" />
          <Text>{service.people}</Text>
        </div>
        <div className="info-item">
          <DollarOutlined className="icon" />
          <Text>{service.fee}</Text>
        </div>
      </div>
      <Button
        type="primary"
        className="expand-button"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide Details" : "View Details"}
      </Button>
      {expanded && (
        <ul className="service-details">
          {service.details.map((detail, index) => (
            <li key={index}>
              <Text>{detail}</Text>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

const ServicesSection = () => {
  return (
    <div className="services-section">
      <Title level={2}>Our Services</Title>
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
      <div className="global-action-buttons">
        <Button
          className="custom-action-button"
          href="https://www.facebook.com/pathwise.techmentorship"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </Button>
        <Button
          className="custom-action-button"
          href="https://docs.google.com/forms/d/e/1FAIpQLSf44FrJ2powtp9MMvGfHcz8F7irZLyfjxaCkIpr-HAr0Fl4oQ/viewform?pli=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default ServicesSection;
