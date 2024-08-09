"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [clickedDiv, setClickedDiv] = useState<string | null>(null);
  const router = useRouter();
  const handleClick = (div: string) => {
    setClickedDiv(div);
    if (div === "left") {
      setTimeout(() => {
        router.push(`/create?room=${generateRandomRoom()}`);
      }, 1000);
    }
    if (div === "right") {
      setTimeout(() => {
        router.push("/jointo");
      }, 1000);
    }
  };

  const generateRandomRoom = () => {
    return Math.random().toString(36).substring(7);
  };
  return (
    <div
      className={`h-screen w-screen grid grid-cols-2 ${clickedDiv ? "animate" : ""}`}
    >
      <div
        className={`bg-white h-screen col-span-1 ${clickedDiv === "left" ? "expand-white" : ""}`}
        onClick={() => handleClick("left")}
      >
        <h1 className="text-7xl font-sans h-screen font-extrabold flex justify-center items-center text-purple-600">
          Create 🎲
        </h1>
      </div>
      <div
        className={`bg-black h-screen col-span-1  ${clickedDiv === "right" ? "expand-black" : ""}`}
        onClick={() => handleClick("right")}
      >
        <h1 className="text-7xl font-sans h-screen font-extrabold flex justify-center items-center text-purple-600">
          Join 🔗
        </h1>
      </div>
    </div>
  );
}
