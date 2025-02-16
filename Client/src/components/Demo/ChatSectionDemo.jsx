import LowerBarDemo from "./LowerBarDemo";
import TopBarDemo from "./TopBarDemo";
import ChatAreaDemo from "./ChatAreaDemo";
export default function ChatSectionDemo() {
    return (
        <div className="flex flex-col w-full h-screen">
            <TopBarDemo />
            <ChatAreaDemo />
            <LowerBarDemo />
        </div>
    )
}