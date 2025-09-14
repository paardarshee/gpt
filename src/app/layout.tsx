// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/SideBar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import TemporaryChat from "@/components/ui/TemporaryChat";
import AuthHeader from "@/components/ui/AuthHeader";

// ✅ Metadata should NOT connect to DB
export const metadata: Metadata = {
  title: "This is CloneGPT",
  description: "This metadata is generated dynamically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="text-md text-text-primary bg-bg-primary flex h-screen max-h-screen w-screen max-w-screen flex-row overflow-hidden font-sans font-[400]">
            {/* Signed Out State */}
            <SignedOut>
              <div className="flex h-full w-full flex-col">
                <AuthHeader />
                <TemporaryChat />
              </div>
            </SignedOut>

            {/* Signed In State */}
            <SignedIn>
              <Sidebar />
              <main className="h-screen flex-1 overflow-auto">{children}</main>
            </SignedIn>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
