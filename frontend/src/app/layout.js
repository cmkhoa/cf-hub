import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot/Chatbot";
import { AuthProvider } from "@/contexts/authContext/authContext";
import { LangProvider } from "@/contexts/langprov";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Career Foundation Hub",
	description:
		"CF Hub empowers young professionals to secure jobs and build successful careers in finance, operations, strategy, marketing, management, and beyond through dedicated mentorship and support.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
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
					<LangProvider>
						{children}
						<Chatbot />
					</LangProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
