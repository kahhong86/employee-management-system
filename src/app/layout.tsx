"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'antd/dist/reset.css'; // Ant Design v5 new reset
import '@ant-design/v5-patch-for-react-19';
import '../styles/api-notifications.css'; // Enhanced API notification styles
import Navigation from "@/components/Navigation";
import { Layout } from "antd";
import { useEffect } from "react";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";

const { Content } = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = "Employee Management System";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'CRUD app with Next.js + Ant Design');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'CRUD app with Next.js + Ant Design';
      document.head.appendChild(meta);
    }
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UnsavedChangesProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Navigation />
            <Content style={{ padding: "0" }}>
              {children}
            </Content>
          </Layout>
        </UnsavedChangesProvider>
      </body>
    </html>
  );
}
