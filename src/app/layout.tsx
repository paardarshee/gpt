import Sidebar from "@/components/SideBar";
import type { Metadata } from "next";
import "./globals.css";
import { connectDB } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
	// You can fetch data or use logic here to generate metadata dynamically
	await connectDB();
	return {
		title: "This is CloneGPT",
		description: "This metadata is generated dynamically.",
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`antialiased w-screen h-screen max-w-screen max-h-screen overflow-hidden gap-6 flex flex-row dark:bg-[#343541] font-[400]  text-md`}
			>
				<Sidebar />
				<div className="flex-1">{children}</div>
			</body>
		</html>
	);
}
