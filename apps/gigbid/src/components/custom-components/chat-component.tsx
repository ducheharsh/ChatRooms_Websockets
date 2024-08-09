import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Socket } from "socket.io-client";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

export default function ChatComponent({
  room,
  socket,
  name,
}: {
  room: string;
  socket: Socket;
  name: string;
}) {
  const [message, setMessage] = useState<string>("");
  const [latestMessage, setLatestMessage] = useState<string[]>([]);
  const [avatarName, setAvatarName] = useState<string[]>([]);
  const [chatContainerHeight, setChatContainerHeight] = useState("h-[500px]");

  useEffect(() => {
    const handleResize = () => {
      // Calculate the appropriate height based on the screen size or other factors
      const newHeight = window.innerHeight - 200; // Example calculation
      setChatContainerHeight(`h-[${newHeight}px]`);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial height

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const sendMessage = () => {
      socket.emit("send_message", { message, room });
      setLatestMessage([...latestMessage, `You: ${message.trim()}`]);
      setMessage("");
  };

  socket?.on("received_message", (data) => {
      console.log("Message received: ", data);
      setLatestMessage([...latestMessage, data]);
    });


  socket?.on("justJoined", (data) => {
      console.log("Joined members: ", data);
      const customConfig: Config = {
        dictionaries: [animals],
        length: 1,
        seed: data.id,
      };
        const name = uniqueNamesGenerator(customConfig);
        console.log('julia',name);
        setAvatarName([...avatarName, name]);
    });


  return (
    <div
      className={`border-4 bg-transparent ml-8 border-purple-500 rounded-3xl mt-12 ${chatContainerHeight} w-[95%] h-[90%] grid grid-cols-4 shadow-lg shadow-slate-700`}
    >
      <div className="col-span-2 rounded-3xl border-r-2">
        <div className=" p-6 h-fit border-b-2 rounded-l-2xl font-semibold text-xl">
          Roommates
        </div>
        {avatarName.map((avatar) => {
          return (
            <div key={avatar} className="text-2xl p-4 flex w-fit h-fit pb-2 text-black">
              <img
                src={`https://api.dicebear.com/9.x/bottts/svg?seed=${avatar}`}
                alt="dice"
                width={40}
                height={40}
              />
              <h1 className="text-2xl mt-1">{avatar}</h1>
            </div>
          );
        })}
      </div>
      <div className="flex col-span-2 rounded-r-2xl overflow-y-scroll items-end h-full">
        <div className="w-full">
          <div className="overflow-y-scroll">
            {latestMessage.map((msg, id) => {
              const [sender, text] = msg.split(": ");
              if (sender === "You") {
                return (
                  <div key={id} className=" mr-28 mb-3 flex flex-col items-start ml-3">
                    <div className="flex rounded-3xl">
                      <img
                        className="mr-1"
                        src={`https://api.dicebear.com/9.x/bottts/svg?seed=${name}`}
                        alt="dice"
                        width={25}
                        height={25}
                      />
                      <h2 className="font-medium text-left text-lg rounded-3xl px-4 py-1 bg-purple-500 text-white">
                        {text}
                      </h2>
                    </div>
                  </div>
                );
              }
              return (
                <div key={id} className=" mr-20 mb-3 flex flex-col items-end">
                  <div className="flex rounded-3xl">
                    <img
                      className="mr-1"
                      src={`https://api.dicebear.com/9.x/bottts/svg?seed=${sender}`}
                      alt="dice"
                      width={25}
                      height={25}
                    />
                    <h2 className="font-medium text-left text-lg rounded-3xl px-4 py-1 bg-purple-500 text-white">
                      {text}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            className="flex float-right m-4 w-[90%]"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              id="msgInput"
              className="mr-2 rounded-3xl"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></Input>
            <Button
              type="submit"
              className="mt-[1] w-fit h-fit rounded-full right-20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
