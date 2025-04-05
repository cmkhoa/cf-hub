"use client";
import React, { useState } from "react";
import { Typography, Modal } from "antd";
import "./OurProcess.css";

const { Title } = Typography;

const OurProcess = () => {
	const [selectedWorkshop, setSelectedWorkshop] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const processData = [
		{
			title: "Workshop 1: Job Search & Networking Strategy",
			points: [
				"Hướng dẫn cách tìm kiếm cơ hội thực tập & việc làm",
				"Khai thác hiệu quả LinkedIn, Glassdoor, Wall Street Oasis",
				"Cách viết email cold reach-out và referral",
			],
			image: "/assets/process/buoi1.png",
		},
		{
			title: "Workshop 2: Resume Review and Optimization",
			points: [
				"Xây dựng resume chuyên nghiệp",
				"Tối ưu ATS-friendly resume",
				"Review từng resume cá nhân và nhận phản hồi",
			],
			image: "/assets/process/buoi2.png",
		},
		{
			title: "Workshop 3: Behavioral Interview Preparation",
			points: [
				"Học phương pháp STAR",
				"Thực hành các câu hỏi phổ biến",
				"Luyện tập phỏng vấn thử 1:1",
			],
			image: "/assets/process/buoi3.png",
		},
		{
			title: "Workshop 4: Break into Wall Streets",
			points: [
				"Overview about Investment Bankers",
				"Talent match: Who's getting into IB",
				"Career path in IB",
			],
			image: "/assets/process/buoi4.png",
		},
		{
			title: "Workshop 5: Bullet Proof Problem Solving",
			points: [
				"MECE Framework",
				"Issue Tree",
				"Phân tích và đề xuất giải pháp",
			],
			image: "/assets/process/buoi5.png",
		},
		{
			title: "Workshop 6: Applied Excel",
			points: [
				"Các hàm quan trọng: XLOOKUP, INDEX-MATCH, IF",
				"Phân tích dữ liệu: Pivot Tables, Solver",
				"Bài tập thực tế",
			],
			image: "/assets/process/buoi6.png",
		},
		{
			title: "Workshop 7: Data Storytelling",
			points: [
				"Thiết kế slides với Canva và PowerPoint",
				"Các bước trình bày case study",
				"Kết hợp biểu đồ và insight",
			],
			image: "/assets/process/buoi7.png",
		},
		{
			title: "Workshop 8: Essential Excel & Presentation",
			points: [
				"Excel: Format, Shortcuts, Power Query",
				"Presentation: Format, graph/chart, best practices",
				"Thực hành và nhận feedback",
			],
			image: "/assets/process/buoi8.png",
		},
		{
			title: "Workshop 9: Case Study Review",
			points: [
				"M&A Case - Citigroup",
				"Operation Analysis - KPMG",
				"Sales Analysis - PepsiCo",
				"Management Consulting - BCG",
			],
			image: "/assets/process/buoi9.png",
		},
		{
			title: "Workshop 10: Case Competition",
			points: [
				"BCG Case Study thực tế",
				"Làm việc nhóm 3-4 người",
				"Trình bày và nhận phản hồi",
			],
			image: "/assets/process/buoi10.png",
		},
	];

	const handleWorkshopClick = (workshop) => {
		setSelectedWorkshop(workshop);
		setIsModalVisible(true);
	};

	const handleModalClose = () => {
		setIsModalVisible(false);
		setSelectedWorkshop(null);
	};

	return (
		<div className="process-container">
			<Title level={2} className="process-title">
				Our Process
			</Title>
			<div className="process-grid">
				{processData.map((process, index) => (
					<div
						key={index}
						className="process-card"
						onClick={() => handleWorkshopClick(process)}
					>
						<Title level={3} className="process-card-title">
							{process.title}
						</Title>
						<ul className="process-points">
							{process.points.map((point, pointIndex) => (
								<li key={pointIndex}>{point}</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<Modal
				visible={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
				width={800}
				className="workshop-modal"
			>
				{selectedWorkshop && (
					<div className="workshop-modal-content">
						<h2>{selectedWorkshop.title}</h2>
						<div className="workshop-image-container">
							<img
								src={selectedWorkshop.image}
								alt={selectedWorkshop.title}
								className="workshop-image"
							/>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default OurProcess;
