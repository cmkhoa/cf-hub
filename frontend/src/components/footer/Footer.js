"use client";

import React from "react";
import { Input, Button, Row, Col, Typography } from "antd";
import { 
	FacebookOutlined, 
	LinkedinOutlined, 
	YoutubeOutlined, 
	InstagramOutlined,
	MailOutlined,
	PhoneOutlined,
	EnvironmentOutlined
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import './Footer.css';

const { Title, Paragraph, Text: AntText } = Typography;

const Footer = () => {
	const handleSubscribe = (e) => {
		e.preventDefault();
		// TODO: Implement subscription logic
	};

	return (
		<footer className="footer">
			{/* Top Section */}
			<div className="footer-top">
				<div className="container">
					<Row justify="space-between" align="middle">
						<Col>
							<AntText className="footer-top-text">About Career Foundation Hub</AntText>
						</Col>
						<Col>
							<AntText className="footer-top-text">Recent News</AntText>
						</Col>
					</Row>
				</div>
			</div>

			{/* Main Footer Content */}
			<div className="footer-main">
				<div className="container">
					<Row gutter={[48, 48]}>
						{/* Brand Section */}
						<Col xs={24} md={8} lg={6}>
							<div className="brand-section">
								<div className="brand-logo">
									<div className="logo-icon">CFH</div>
									<span className="logo-text">CF Hub</span>
								</div>
								<Paragraph className="brand-description">
									CF Hub là tổ chức phi lợi nhuận 501(c)(3) được thành lập bởi các bạn trẻ 
									sinh viên và chuyên gia người Việt tại Mỹ, nhằm trở thành nền tảng cộng đồng 
									hỗ trợ sinh viên và các bạn trẻ trong quá trình chuyển đổi từ môi trường học 
									thuật sang môi trường chuyên nghiệp, giúp các bạn kết nối và phát triển.
								</Paragraph>
								<Title level={5} className="follow-title">Follow Us</Title>
								<div className="social-links">
									<Button 
										type="text" 
										icon={<FacebookOutlined />}
										className="social-btn facebook"
									/>
									<Button 
										type="text" 
										icon={<LinkedinOutlined />}
										className="social-btn linkedin"
									/>
									<Button 
										type="text" 
										icon={<YoutubeOutlined />}
										className="social-btn youtube"
									/>
								</div>
							</div>
						</Col>

						{/* Categories */}
						<Col xs={12} md={8} lg={6}>
							<div className="links-section">
								<Title level={5} className="links-title">Categories</Title>
								<div className="categories-grid">
									<div className="category-column">
										<Link href="/big-tech">Big Tech, Fortune 500 & Top Companies</Link>
										<Link href="/events">Events & Community</Link>
										<Link href="/blog">Main Blog</Link>
										<Link href="/professional-development">Professional Development</Link>
										<Link href="/resume-tips">Resume, Job Search & Interview Tips</Link>
										<Link href="/immigration">Immigration & Visas</Link>
									</div>
									<div className="category-column">
										<Link href="/industry-insights">Industry Insights</Link>
										<Link href="/networking">Networking Tips</Link>
										<Link href="/success-stories">Success Stories</Link>
										<Link href="/conference">Viet Career Conference</Link>
										<Link href="/webinars">Webinars & Workshops</Link>
									</div>
								</div>
							</div>
						</Col>

						{/* Tags */}
						<Col xs={12} md={8} lg={6}>
							<div className="links-section">
								<Title level={5} className="links-title">Tags</Title>
								<div className="tags-cloud">
									{[
										'application', 'behavioral interview', 'career', 'career review', 
										'challenge', 'computer science', 'conference', 'connection', 'cpt', 
										'google', 'infrastructure engineer', 'interview', 'interview preparation', 
										'job', 'job market', 'job search', 'networking', 'opt', 'preparing', 
										'project', 'promotion', 'referral', 'resume', 'sde', 'sharing', 
										'stem-opt', 'strategies', 'strength', 'viet-career-conference', 
										'vietnamese', 'visa', 'weakness'
									].map((tag, index) => (
										<span key={index} className="tag-item">{tag}</span>
									))}
								</div>
							</div>
						</Col>

						{/* Recent News */}
						<Col xs={24} md={24} lg={6}>
							<div className="news-section">
								<Title level={5} className="links-title">Recent News</Title>
								<div className="news-list">
									<div className="news-item">
										<div className="news-image">
											<Image
												src="/assets/mentors/linh_nguyen.jpg"
												alt="Referral discussion"
												width={60}
												height={40}
												className="news-img"
											/>
										</div>
										<div className="news-content">
											<div className="news-title">Một chút bàn luận về Referral</div>
											<div className="news-date">SEPTEMBER 7, 2025</div>
										</div>
									</div>
									<div className="news-item">
										<div className="news-image">
											<Image
												src="/assets/mentors/tribui.jpg"
												alt="Resources and projects"
												width={60}
												height={40}
												className="news-img"
											/>
										</div>
										<div className="news-content">
											<div className="news-title">Resources, project, và những câu chuyện chưa kể</div>
											<div className="news-date">SEPTEMBER 5, 2025</div>
										</div>
									</div>
									<div className="news-item">
										<div className="news-image">
											<Image
												src="/assets/mentors/winnie.jpg"
												alt="Job search strategy"
												width={60}
												height={40}
												className="news-img"
											/>
										</div>
										<div className="news-content">
											<div className="news-title">TIMELINE & JOB SEARCH STRATEGY FOR RECRUITING SEASON</div>
											<div className="news-date">SEPTEMBER 3, 2025</div>
										</div>
									</div>
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
								© 2025 CF Hub Corporation - Official website of CF Hub Corporation.
							</Paragraph>
						</Col>
					</Row>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
