import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/SideBar";
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
  await connectDB();
  return (
    <html lang="en">
      <body
        className={`text-md flex h-screen max-h-screen w-screen max-w-screen flex-col overflow-hidden font-sans font-[400] md:flex-row dark:bg-[#343541]`}
      >
        <Sidebar />
        <div className="h-[calc(100vh-64px)] flex-1 md:h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
