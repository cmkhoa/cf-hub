"use client";

import React from "react";
import { Input, Button } from "antd";
import styles from "./Footer.module.css";

const Footer = () => {
	const handleSubscribe = (e) => {
		e.preventDefault();
		// TODO: Implement subscription logic
	};

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.footerContent}>
					{/* Left Section - Brand */}
					<div className={styles.brandSection}>
						<h2 className={styles.brandName}>CF Hub</h2>
						<p className={styles.brandSlogan}>
							Competitive Programming - Community - Growth
						</p>
						<p className={styles.brandDescription}>
							Join our community to enhance your competitive programming skills
							and connect with like-minded individuals.
						</p>
					</div>

					{/* Middle Section - Subscribe */}
					<div className={styles.subscribeSection}>
						<div className={styles.subscribeWrapper}>
							<h3>Subscribe to Us</h3>
							<p className={styles.subscribeText}>
								Stay updated with our latest news and updates
							</p>
							<div className={styles.subscribeForm}>
								<Input
									placeholder="Enter your email"
									className={styles.subscribeInput}
								/>
								<Button type="primary" onClick={handleSubscribe}>
									Subscribe
								</Button>
							</div>
						</div>
					</div>

					{/* Right Section - Quick Links */}
					<div className={styles.linksSection}>
						<div className={styles.linkColumn}>
							<h4 className={styles.linkTitle}>Navigation</h4>
							<a href="/">Home</a>
							<a href="/about">About Us</a>
							<a href="/contact">Contact</a>
							<a href="/blog">Blog</a>
						</div>
						<div className={styles.linkColumn}>
							<h4 className={styles.linkTitle}>Services</h4>
							<a href="/activities">Activities</a>
							<a href="/services">Services</a>
							<a href="/results">Results</a>
							<a href="/apply">Apply Now</a>
						</div>
						<div className={styles.linkColumn}>
							<h4 className={styles.linkTitle}>Resources</h4>
							<a href="/mentorship">Mentorship</a>
							<a href="/workshops">Workshops</a>
							<a href="/competitions">Competitions</a>
							<a href="/faq">FAQ</a>
						</div>
					</div>
				</div>

			</div>
		</footer>
	);
};

export default Footer;
