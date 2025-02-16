import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import Loader from "../ui/Bear";

export default function ChatAreaDemo() {
    const { messages, selectedUserData } = useSelector((state) => state.chat);
    const { authUser } = useSelector((state) => state.auth);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col w-full h-full z-0 overflow-hidden">
            <ScrollArea className="h-full w-full" ref={scrollRef}>
                {messages?.length === 0 ? (
                    <div className="flex  items-center w-full justify-center h-full">
                        <Loader />
                    </div>
                ) : null}

                {messages.map((message, index) => {
                    return (
                        <div key={index}>
                            {message.senderID === selectedUserData._id ? (
                                <div className="flex flex-col items-start p-4">
                                    <div className="flex space-x-2">
                                        <Avatar>
                                            <AvatarImage
                                                src={selectedUserData.profileImage || defaultUserImage}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>{selectedUserData.name}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div
                                                className={`p-2 px-4 rounded-xl ${
                                                    message.sender === selectedUserData._id
                                                        ? "bg-white/10 text-white"
                                                        : "bg-white/10"
                                                } h-fit-content max-w-80 text-sm`}
                                            >
                                                {message.text === "" ? <img src={message.image} className="my-2 rounded-md" alt="message" /> : message.text}
                                            </div>
                                            <span className="text-xs mt-2 text-muted-foreground">
                                                {new Date(message.createdAt).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col p-4 items-end">
                                    <div className="flex space-x-2">
                                        <div className="flex flex-col">
                                            <div
                                                className={`p-2 px-4 rounded-xl ${
                                                    message.sender === selectedUserData._id
                                                        ? "bg-white/10 text-white"
                                                        : "bg-white/10"
                                                } h-fit-content max-w-80 text-sm`}
                                            >
                                                {message.text === "" ? <img src={message.image} className="my-2 rounded-md" alt="message" /> : message.text}
                                            </div>
                                            <span className="text-xs mt-2 text-muted-foreground text-right">
                                                {new Date(message.createdAt).toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <Avatar>
                                            <AvatarImage
                                                src={authUser.profileImage || defaultUserImage}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>{authUser.name}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </ScrollArea>
        </div>
    );
}
