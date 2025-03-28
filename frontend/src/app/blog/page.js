"use client";
import MentorshipContentLayout from "@/components/componentForBlogPage/MentorshipContentLayout/MentorshipContentLayout";
import FooterComponent from "@/components/footer/Footer";
import HeaderComponent from "@/components/header/header";
import { Layout } from "antd";
import React, { useState } from "react";

// Sample blog post data with images and translated content
const blogPosts = [
  {
    id: "resume",
    title: "Cách viết CV hiệu quả để được gọi phỏng vấn",
    date: "10 Tháng 11, 2024",
    excerpt: "Cải thiện hồ sơ xin việc của bạn bằng những cách đơn giản này.",
    image: "/images/resume.jpeg",
  },
  {
    id: "response",
    title: "Chiến Lược Tăng Tỉ Lệ Phản Hồi Khi Apply Intern",
    date: "5 Tháng 11, 2024",
    excerpt:
      "Các cách để cải thiện hồ sơ và có những advantage nhỏ khi apply việc.",
    image: "/images/response1.jpg",
  },
  {
    id: "techlayoff",
    title: "2023 - Năm đen tối của ngành công nghệ tại Mỹ",
    date: "20 Tháng 10, 2024",
    excerpt:
      "Ngành công nghệ tại Hoa Kỳ đã chứng kiến sự giảm việc làm đáng kể vào năm 2023.",
    image: "/images/tech_layoff2.jpg",
  },
  {
    id: "aitools",
    title:
      "CHATGPT 4.0 VS GEMINI ADVANCED: Đâu là sự lựa chọn hoàn hảo cho bạn?",
    date: "11 Tháng 10, 2024",
    excerpt:
      "AI đang dần len lỏi vào mọi ngóc ngách của đời sống, và việc lựa chọn một nền tảng AI phù hợp là vô cùng quan trọng.",
    image: "/images/aitools.jpg",
  },
  {
    id: "getinternship",
    title: "Bí Kíp Để Có Thực Tập Hè",
    date: "1 Tháng 10, 2024",
    excerpt:
      "Làm thế nào để sinh viên năm nhất và năm hai cưa đổ kỳ thực tập mùa hè.",
    image: "/images/getinternship.jpg",
  },
];

const Blog = () => {
  const [current, setCurrent] = useState("blog");

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <Layout>
      <HeaderComponent current={current} handleClick={handleClick} />
      <MentorshipContentLayout blogPosts={blogPosts} />
      <FooterComponent />
    </Layout>
  );
};

export default Blog;
