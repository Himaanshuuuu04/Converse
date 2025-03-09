import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import GenerateCallSection from "@/components/Demo/GenerateCallSection";
import IncomingCallSection from "@/components/Demo/IncomingCallSection";
export default function Call() {
  const { id } = useParams();
  const { outgoingCall, incomingCall, callAccepted, callRejected, callEnded } =
    useSelector((state) => state.call);
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {outgoingCall && <GenerateCallSection id={id} />}
            {incomingCall && <IncomingCallSection />}
        </div>
    );
}
