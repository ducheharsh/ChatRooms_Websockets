"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import ChatComponent from "@/components/custom-components/chat-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


export default function Join() {

  const [connected, setConnected] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);
  const [name, setName] = useState<string>("");

  const room = searchParams.get("room");
  const router = useRouter();
  useEffect(() => {
    // Create the socket connection only once
    socketRef.current = io("http://localhost:3002");
    // Clean up the socket connection when the component unmounts
    
    socketRef.current?.emit("joinRoom", room);
    NameSet();
    socketRef.current.emit("joinedMembers", { room, id: socketRef.current.id });
    setConnected(true);
  }, []);

   // setting name of the user
  const NameSet = async() => {
    if (socketRef.current) {
      socketRef.current.emit("connected");
      socketRef.current.on("connected", (data) => {
        setName(data.name);
      });
    }
  }

  const joinRoom = async () => {
    socketRef.current?.emit("joinRoom", room);
    setConnected(true);
  };

  useEffect(() => {
  socketRef.current?.on("error", (data) => {
    console.log("Error: ", data);
    if (data === "Room does not exist") {
      alert("Room does not exist");
      router.push("/");
    }
  })
  return () => {
    socketRef.current?.off("error");
  }
},[])



  return (
  
    <div className="md:grid grid-cols-3 h-screen ">
      <div className="text-8xl col-span-1 h-fit font-sans w-fit font-extrabold text-purple-600 move-top-right">
        <div className="flex flex-col">
          <span className="w-fit">Welcome,</span>
          <span className="w-fit ">
            {name}
            <img
              src={`https://api.dicebear.com/9.x/bottts/svg?seed=${name}`}
              alt="dice"
              width={80}
              height={80}
            />
          </span>
        </div>
        <div className="flex mt-4 ">
          <Input
            className={`w-2/4 text-center text-xl font-mono ring-2 ${connected ? "ring-green-600" : "ring-red-600"}`}
            value={room}
          />
          <Button
            className="rounded-full ml-4 h-fit w-fit"
            onClick={() => joinRoom()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
          </Button>
        </div>
      </div>
      <div className="mt-4 col-span-2 h-screen">
        {socketRef.current && (
          <ChatComponent name={name} socket={socketRef.current} room={room} />
        )}
      </div>
    </div>

  );
}
