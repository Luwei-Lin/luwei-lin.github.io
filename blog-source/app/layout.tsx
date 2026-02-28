import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luwei (Luis) Lin | Blog",
  description: "Technical blog and portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-100 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Luwei (Luis) Lin. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
