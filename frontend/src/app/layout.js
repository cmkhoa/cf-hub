import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot/Chatbot";
import { AuthProvider } from "@/contexts/authContext/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "CF Hub Mentorship",
	title: "Career Foudnation Hub",
	description:
		"This is a mentorship program for students/new graduates looking for internships/jobs in the US.",
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
				{/* Favicon */}
				<link rel="icon" href="/images/cfhub-logo.jpg" type="image/jpeg" />
				<link rel="shortcut icon" href="/images/cfhub-logo.jpg" type="image/jpeg" />
				<link
					href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className={inter.className}>
				<AuthProvider>
					{children}
					<Chatbot />
				</AuthProvider>
			</body>
		</html>
	);
}
