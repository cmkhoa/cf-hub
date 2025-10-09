import React from "react";
import { Typography } from "antd";
import { useLang } from "@/contexts/langprov";
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

const AboutContent = () => {
  const { t } = useLang();
  
  return (
    <div className="about-content">
      <p>
        {t("aboutUs.intro")}
      </p>

      <p style={{ marginTop: "20px" }}>{t("aboutUs.joinTitle")}</p>

      <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
        <li>{t("aboutUs.reasons.contribute")}</li>
        <li>{t("aboutUs.reasons.share")}</li>
        <li>{t("aboutUs.reasons.recruit")}</li>
        <li>{t("aboutUs.reasons.cofounder")}</li>
        <li>{t("aboutUs.reasons.referral")}</li>
        <li>{t("aboutUs.reasons.resume")}</li>
        <li>{t("aboutUs.reasons.mentor")}</li>
        <li>{t("aboutUs.reasons.insights")}</li>
        <li>{t("aboutUs.reasons.connect")}</li>
      </ul>

      <p style={{ marginTop: "20px" }}>
        {t("aboutUs.nonprofit")}
        <a
          href="https://www.sinhvienusa.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("aboutUs.sinhvien")}
        </a>
        {t("aboutUs.vietchallenge")}
        <a
          href="https://www.vietchallenge.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.vietchallenge.org
        </a>
        {t("aboutUs.betaNote")}
      </p>
    </div>
  );
};

const AboutUs = () => {
  const { t } = useLang();
  
  return (
    <>
      {/* Full-width banner at the top */}
      <div className="about-banner">
        <img
          src="/assets/offline-event2.png"
          alt="About CF Hub Banner"
          className="about-banner-image"
        />
      </div>

      {/* Content section below the banner */}
      <div className="about-us-container">
        <Title level={2} className="about-us-title">
          {t("aboutUs.title")}
        </Title>
        <div className="about-us-sticky">
          <AboutContent />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
