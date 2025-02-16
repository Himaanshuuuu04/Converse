import { Button } from "../components/ui/button";
import { CardDemo } from "../components/Demo/CardDemo";
import { useSelector } from "react-redux";
import NoChatContainer from "@/Components/Demo/NoChatContainer";
import ChatSectionDemo from "@/components/Demo/ChatSectionDemo";

export default function Home() {
    const { selectedUser } = useSelector((state) => state.chat);

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex h-screen">
                <div className="flex flex-col overflow-y-auto overflow-x-hidden min-w-[380px]">
                    <CardDemo className="w-full bg-black p-0 min-h-screen rounded-none" />
                </div>
                <div className="w-full flex justify-center">
                    {!selectedUser ? <NoChatContainer /> : <ChatSectionDemo />}
                </div>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden h-screen w-full">
                {!selectedUser && (
                    <div className="w-full flex flex-col overflow-y-auto">
                        <CardDemo className="w-full bg-black p-0 min-h-screen rounded-none" />
                    </div>
                )}
            </div>
        </>
    );
}