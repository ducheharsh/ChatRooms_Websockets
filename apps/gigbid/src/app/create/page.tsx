"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import ChatComponent from "@/components/custom-components/chat-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Create() {
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);
  const room = searchParams.get("room");
  const router = useRouter();

  useEffect(() => {
    // Create the socket connection only once
    socketRef.current = io("http://localhost:3002");
    // Clean up the socket connection when the component unmounts
    socketRef.current?.emit("createRoom", room);
    router.push(`/join?room=${room}`);
  }, []);

 // setting name of the user


  const createRoom = async () => {
    socketRef.current?.emit("createRoom", room);
  };

  useEffect(() => {
    socketRef.current?.on("error", (data) => {
      console.log("Error: ", data);
      if (data === "Room already exists") {
        alert("Room already exists (Please try another room)");
        router.push("/");
      }
    })
    return () => {
      socketRef.current?.off("error");
    }
  },[])

  return (

<div>
  redirecting to join page
</div>
   
  );
}
