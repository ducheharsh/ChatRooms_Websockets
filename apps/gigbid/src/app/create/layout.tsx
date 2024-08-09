"use client";
import { Suspense, useEffect, useRef } from "react";
import { Inter as FontSans } from "next/font/google";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

function getRandomPosition(svgWidth: number, svgHeight: number) {
  const x = Math.random() * (window.innerWidth - svgWidth);
  const y = Math.random() * (window.innerHeight - svgHeight);
  return { x, y };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const positionsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const svgs = document.querySelectorAll("svg");
    if (positionsRef.current.length === 0) {
      svgs.forEach((svg) => {
        const svgRect = svg.getBoundingClientRect();
        const { x, y } = getRandomPosition(svgRect.width, svgRect.height);
        positionsRef.current.push({ x, y });
        svg.style.transform = `translate(${x}px, ${y}px)`;
      });
    } else {
      svgs.forEach((svg, index) => {
        const { x, y } = positionsRef.current[index];
        svg.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  }, []);

  return (
    <html lang="en">
      <body
        id="create"
        style={{ backgroundColor: "white" }}
        className="min-h-screen bg-white min-w-screen font-sans"
      >
        <Suspense>
        {children}
        </Suspense>
      </body>
    </html>
  );
}
