import React from "react";
import { Typography, Button } from "antd";
import { LinkedinOutlined } from "@ant-design/icons";
import { useLang } from "@/contexts/langprov";
import "./AboutUs.css";

const { Title, Text } = Typography;

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
  
  const teamMembers = [
    {
      key: "quang",
      linkedin: "https://www.linkedin.com/in/quang1401/",
      image: "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730786179/qz0r41jqmatncyl9h6py.jpg",
    },
    {
      key: "tri",
      linkedin: "https://www.linkedin.com/in/tribuidinh/",
      image: "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730786150/vqyqmxshnub26yu08dpr.jpg",
    },
    {
      key: "anh",
      linkedin: "https://www.linkedin.com/in/anhmngo/",
      image: "http://res.cloudinary.com/dbqcioj2g/image/upload/v1730176141/tfiotmhqb6vpkofuh5py.jpg",
    },
  ];
  
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

        {/* Team Members Section
        <div style={{ marginTop: "60px" }}>
          <Title level={2} className="about-us-title">
            {t("aboutUs.teamTitle")}
          </Title>
          {teamMembers.map((member, index) => (
            <div key={member.key} className="member-row">
              {index % 2 === 0 ? (
                <>
                  <div className="description-column" style={{ flex: 1 }}>
                    <Text className="member-name">
                      {t(`aboutUs.teamMembers.${member.key}.name`)}
                    </Text>
                    {t(`aboutUs.teamMembers.${member.key}.description`).map((desc, i) => (
                      <Text key={i} className="member-description">
                        {desc}
                      </Text>
                    ))}
                    <Button
                      type="link"
                      icon={<LinkedinOutlined className="linkedin-icon" />}
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                    >
                      {t("aboutUs.viewLinkedIn")}
                    </Button>
                  </div>
                  <div className="image-column" style={{ flex: 1 }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={member.image}
                        alt={t(`aboutUs.teamMembers.${member.key}.name`)}
                        className="member-image"
                      />
                      <div className="role-label">
                        {t(`aboutUs.teamMembers.${member.key}.role`)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="image-column" style={{ flex: 1 }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={member.image}
                        alt={t(`aboutUs.teamMembers.${member.key}.name`)}
                        className="member-image"
                      />
                      <div className="role-label">
                        {t(`aboutUs.teamMembers.${member.key}.role`)}
                      </div>
                    </div>
                  </div>
                  <div className="description-column" style={{ flex: 1 }}>
                    <Text className="member-name">
                      {t(`aboutUs.teamMembers.${member.key}.name`)}
                    </Text>
                    {t(`aboutUs.teamMembers.${member.key}.description`).map((desc, i) => (
                      <Text key={i} className="member-description">
                        {desc}
                      </Text>
                    ))}
                    <Button
                      type="link"
                      icon={<LinkedinOutlined className="linkedin-icon" />}
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                    >
                      {t("aboutUs.viewLinkedIn")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default AboutUs;
