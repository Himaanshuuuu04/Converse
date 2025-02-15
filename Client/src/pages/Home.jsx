import { Button } from "../components/ui/button";
import { CardDemo } from "../components/Demo/CardDemo";
import { useSelector } from "react-redux";
import NoChatContainer from "@/Components/Demo/NoChatContainer";
export default function Home() {
    const { selectedUser } = useSelector(state => state.chat);
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex h-screen w-full">
                <div className="flex flex-col overflow-y-auto overflow-x-hidden w-[380px]">
                    <div className="mt-10l-5 flex flex-col">
                        <CardDemo className={"w-full bg-black p-0 min-h-screen rounded-none "} />
                    </div>
                </div>
                <div className="w-[calc(100vw-380px)] flex justify-center">
                    {!selectedUser ? <NoChatContainer /> : null}
                </div>
            </div>
            {/* Mobile */}
            <div className="flex md:hidden h-screen w-full">
                {!selectedUser ? (
                    <div className="w-full flex flex-col overflow-y-auto">
                        <CardDemo className="w-full bg-black p-0 min-h-screen rounded-none" />
                    </div>
                ) : null}
            </div>
        </>
    );
} 