import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import defaultUserImage from "../../assets/defaultUserImage.jpeg";
import { getMessages, subscribeToMessages, unsubscribeToMessages, deleteMessage } from "@/redux/slice/chatSlice";
import BlurText from "../ui/TextAnimations/BlurText/BlurText";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

import { useToast } from "@/hooks/use-toast";

export default function ChatAreaDemo() {
    const dispatch = useDispatch();
    const { messages, selectedUserData } = useSelector((state) => state.chat);
    const { authUser } = useSelector((state) => state.auth);
    const messagesEndRef = useRef(null);
    const {toast} = useToast();

    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!selectedUserData) return;
        dispatch(getMessages(selectedUserData));
        dispatch(subscribeToMessages());
        return () => {
            dispatch(unsubscribeToMessages());
        };
    }, [dispatch, selectedUserData]);

    const handleDeleteMessage = (message) => {
        dispatch(deleteMessage({data:message,toast}));
    };

    return (
        <div className="flex flex-col w-full h-full z-0 overflow-hidden">
            <ScrollArea className="h-full w-full">
                {messages?.length === 0 ? (
                    <div className="flex items-center w-full justify-center h-full">
                        <BlurText
                            text="Lol, there is nothing to showup👀"
                            delay={100}
                            animateBy="words"
                            direction="top"
                            className="text-2xl m-10"
                        />
                    </div>
                ) : null}

                {messages.map((message, index) => (
                    <div key={index} ref={messagesEndRef}>
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
                                            {message.text === "" ? (
                                                <img src={message.image} className="my-2 rounded-md" alt="message" />
                                            ) : (
                                                message.text
                                            )}
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
                                    <ContextMenu>
                                        <ContextMenuTrigger>
                                            <div className="flex flex-col">
                                                <div
                                                    className={`p-2 px-4 rounded-xl ${
                                                        message.sender === selectedUserData._id
                                                            ? "bg-white/10 text-white"
                                                            : "bg-white/10"
                                                    } h-fit-content max-w-80 text-sm`}
                                                >
                                                    {message.text === "" ? (
                                                        <img src={message.image} className="my-2 rounded-md" alt="message" />
                                                    ) : (
                                                        message.text
                                                    )}
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
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                 onClick={() => handleDeleteMessage(message)}>
                                                    Delete this message
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
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
                ))}
            </ScrollArea>
        </div>
    );
}
