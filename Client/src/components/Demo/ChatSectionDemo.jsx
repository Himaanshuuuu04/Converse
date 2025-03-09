import LowerBarDemo from "./LowerBarDemo";
import TopBarDemo from "./TopBarDemo";
import ChatAreaDemo from "./ChatAreaDemo";
import { useSelector } from "react-redux";
import CallSection from "./GenerateCallSection";
export default function ChatSectionDemo() {
    const {outgoingCall,incomingCall} = useSelector((state) => state.call);

    return (
        <div className="flex flex-col w-full h-full overflow-auto">
            
            {(outgoingCall || incomingCall)?<CallSection/>:(
                <>
                <TopBarDemo />
                <ChatAreaDemo />
                <LowerBarDemo />
                </>
            )}
        </div>
    )
}