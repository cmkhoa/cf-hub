import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "CF Hub Mentorship",
	description:
		"This is a mentorship program for students looking for internships/jobs in the US.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="vi">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className={inter.className}>
				{children}
				<Chatbot />
			</body>
		</html>
	);
}
