"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Jointo() {
  const [roomId, setRoomId] = useState<string>("");
  const router = useRouter();
  const handleClick = () => {
    setTimeout(() => {
      router.push(`/join?room=${roomId}`);
    }, 1000);
  };
  return (
    <div className={`bg-black h-screen col-span-1 `}>
      <div className="text-7xl font-sans h-screen font-extrabold flex justify-center items-center text-purple-600">
        Join 🔗
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="flex flex-col items-center"
      >
        <Input
          placeholder="Enter Room ID"
          onChange={(e) => setRoomId(e.target.value)}
          className="w-1/2"
        />
        <Button type="submit" onClick={handleClick} className="w-1/2 mt-4" />
      </form>
    </div>
  );
}
