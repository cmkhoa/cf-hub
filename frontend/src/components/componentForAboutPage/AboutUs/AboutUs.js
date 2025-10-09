import React from "react";
import { Typography } from "antd";
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

const AboutContent = () => (
  <div className="about-content">
    <p>
      VNPN là mạng lưới kết nối chuyên gia Việt tại Hoa Kỳ. Nhiệm vụ của VNPN là
      tạo ra cơ hội phát triển sự nghiệp cho mọi thành viên thông qua việc tiếp
      cận với các nguồn thông tin tuyển dụng có ưu thế, kiến thức chuyên ngành
      và kinh nghiệm cố vấn từ những người đi trước. VNPN mong muốn được góp
      phần xây dựng cộng đồng người Việt Nam ở nước ngoài gắn kết, tương trợ lẫn
      nhau.
    </p>

    <p style={{ marginTop: "20px" }}>Bạn tham gia VNPN vì:</p>

    <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
      <li>
        Bạn muốn đóng góp, hỗ trợ xây dựng cộng đồng người Việt Nam ở Hoa Kỳ
      </li>
      <li>Bạn muốn kinh nghiệm của mình được chia sẻ và sử dụng</li>
      <li>Bạn muốn tìm thành viên mới cho công ty bạn đang làm</li>
      <li>Bạn muốn tìm đồng sáng lập (co-founder) cho start-up của mình</li>
      <li>
        Bạn muốn có cơ hội có được giới thiệu từ bên trong (internal job
        referral)
      </li>
      <li>
        Bạn muốn hỗ sơ xin việc (resume) của mình được đánh giá (review) từ
        những người nhiều kinh nghiệm cùng ngành
      </li>
      <li>
        Bạn muốn tìm một người hướng dẫn có nhiều kinh nghiệm để phát triển sự
        nghiệp
      </li>
      <li>
        Bạn muốn tìm hiểu về công ty bạn quan tâm qua góc nhìn của những người
        Việt làm việc ở đó
      </li>
      <li>
        Bạn muốn kết nối với các thành viên khác đang làm việc khắp nơi trên
        nước Mỹ
      </li>
    </ul>

    <p style={{ marginTop: "20px" }}>
      VNPN là dự án phi lợi nhuận, được triển khai với sự hỗ trợ từ Hội Thanh
      Niên, Sinh Viên Việt Nam ở Hoa Kỳ (
      <a
        href="https://www.sinhvienusa.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.sinhvienusa.org
      </a>
      ) và cuộc thi khởi nghiệp VietChallenge (
      <a
        href="https://www.vietchallenge.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        www.vietchallenge.org
      </a>
      ). Dự án hiện tại đang được thử nghiệm ở giai đoạn Beta.
    </p>
  </div>
);

const AboutUs = () => (
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
        About Us
      </Title>
      <div className="about-us-sticky">
        <AboutContent />
      </div>
    </div>
  </>
);

export default AboutUs;
