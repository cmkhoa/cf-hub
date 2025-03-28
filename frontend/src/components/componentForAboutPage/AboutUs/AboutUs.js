import React from "react";
import { Row, Col, Typography } from "antd";
import { LinkedinOutlined } from "@ant-design/icons";
import "./AboutUs.css";

const { Title, Text } = Typography;

const teamMembers = [
  {
    name: "Quang Nguyen",
    role: "Head Mentor",
    linkedin: "https://www.linkedin.com/in/quang1401/",
    description: [
      "Quang Nguyen is currently a Software Engineer at Microsoft. He previously interned as a software engineer at NVIDIA (Summer 2023) and Facebook (Summer 2022).",
      "He received a full-ride scholarship worth $73,000/year for 4 years at Rice University, majoring in Computer Science.",
      "As the President of Rice Apps (Rice Software Engineering Club) at Rice University, he has mentored and taught over 60 members about professional web and mobile application development.",
    ],
    image:
      "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730786179/qz0r41jqmatncyl9h6py.jpg",
  },
  {
    name: "Tri Bui",
    role: "Mentor",
    linkedin: "https://www.linkedin.com/in/tribuidinh/",
    description: [
      "Tri Bui currently works in Risk Management at Revantage, a Blackstone portfolio company, and has interned as a Software Engineer at Daikin, DetectAuto, and Deloitte Vietnam.",
      "Founder/CEO of Esmart Solutions, a company providing communication and technology solutions to small and medium-sized businesses in Vietnam.",
      "President of the Entrepreneurship and Investment Clubs at Macalester College. He has won multiple awards in technology, finance, and entrepreneurship, with a total value exceeding $15,000.",
    ],
    image:
      "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730786150/vqyqmxshnub26yu08dpr.jpg",
  },
  {
    name: "Anh Ngo",
    role: "Advisor",
    linkedin: "https://www.linkedin.com/in/anhmngo/",
    description: [
      "Anh Ngo is currently an Investment Banking Analyst at Deutsche Bank.",
      "She received a scholarship to study Economics at the University of Pennsylvania (UPenn).",
      "Vice President of the Wharton Finance Club and a member of the International Student Advisory Board at UPenn.",
      "She has extensive experience working at UPenn Career Services, where she has assisted over 200 students with resume reviews and career guidance.",
    ],
    image:
      "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730176141/tfiotmhqb6vpkofuh5py.jpg",
  },
];

const AboutUs = () => (
  <div>In maintenance</div>
  // <div className="about-us-container">
  //   <Title level={2} className="about-us-title">
  //     Our Team
  //   </Title>
  //   <Text className="about-us-intro">
  //     We are Vietnamese students in the U.S. who have experienced many
  //     challenges during our studies and job search journeys here. Understanding
  //     the difficulties of applying to hundreds of positions without receiving a
  //     single interview, Pathwise Mentorship program was established with the
  //     mission to build a community that shares knowledge and experiences to help
  //     Vietnamese students achieve their dream jobs.
  //   </Text>
  //   {teamMembers.map((member, index) => (
  //     <Row
  //       className="member-row"
  //       align="middle"
  //       justify="center"
  //       key={index}
  //       gutter={[32, 32]}
  //     >
  //       <Col xs={24} md={14} className="description-column">
  //         <Text className="member-name">{member.name.toUpperCase()}</Text>
  //         {member.description.map((paragraph, idx) => (
  //           <Text key={idx} className="member-description">
  //             {paragraph}
  //           </Text>
  //         ))}
  //         <a
  //           href={member.linkedin}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="linkedin-link"
  //         >
  //           <LinkedinOutlined className="linkedin-icon" />
  //           <span>LinkedIn</span>
  //         </a>
  //       </Col>
  //       <Col xs={24} md={10} className="image-column">
  //         <div className="role-label">{member.role.toUpperCase()}</div>
  //         <img src={member.image} alt={member.name} className="member-image" />
  //       </Col>
  //     </Row>
  //   ))}
  // </div>
);

export default AboutUs;
