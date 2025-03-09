import { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import defaultUserImage from "@/assets/defaultUserImage.jpeg";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { PhoneOff, VideoOff, MicOff } from "lucide-react";
import { PhoneIncoming } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { endCall, acceptCall, rejectCall } from "@/redux/slice/callSlice";
import peer from "@/service/peer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Toggle } from "@/components/ui/toggle";
export default function IncomingCallSection({ id }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { callerData, callerID, incomingOffer } = useSelector(
    (state) => state.call
  );
  const [myVideo, setMyVideo] = useState(null);
  const mainVideoRef = useRef(null);
  const overlayVideoRef = useRef(null);
  const isMountedRef = useRef(true); // Track component mount status

  const handleRejectCall = () => {
    dispatch(rejectCall({ toast,id:callerID }));
  };

  const handleIncomingCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (!isMountedRef.current) {
        // Component unmounted, so stop the stream and exit.
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      setMyVideo(stream);
      if (mainVideoRef.current) {
        mainVideoRef.current.srcObject = stream;
      }
      if (overlayVideoRef.current) {
        overlayVideoRef.current.srcObject = stream;
      }
      const answer = await peer.getAnswer(incomingOffer);
      if (isMountedRef.current) {
        dispatch(acceptCall({ toast, answer, id }));
      }
    } catch (err) {
      console.log("Error in getting user media: ", err);
    }
  }, [dispatch, id, toast]);

  

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Card className="rounded-none w-full h-full relative overflow-hidden">
        <CardHeader className="text-center py-4">
          <CardTitle>{callerData.fullName?callerData.fullName:"user"}</CardTitle>
          <CardDescription>Video Call</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="flex justify-center items-center p-4">
          {/* Video Container */}
          <div className="w-full h-[calc(100vh-25vh)] max-w-4xl relative rounded-xl overflow-hidden">
            {/* {myVideo && (
              <video
                ref={mainVideoRef}
                autoPlay
                playsInline
                
                className="absolute top-0 left-0 w-full h-full"
              />
            )} */}
            <div className="bg-white/10 w-full h-full rounded-lg overflow-hidden shadow-lg border flex items-center justify-center">
              <Avatar  className="w-80 h-80 object-cover">
                <AvatarImage
                  src={callerData.profileImage?callerData.profileImage:defaultUserImage}
                  alt={callerData.fullName?callerData.fullName:"user"}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>{callerData.fullName?callerData.fullName:"user"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          {/* Smaller Video - Overlay */}
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg overflow-hidden shadow-lg border bg-black">
            {myVideo && (
              <video
                ref={overlayVideoRef}
                autoPlay
                playsInline
                className="w-full h-full"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-6 items-center py-4 px-6">
          <Button
            variant="outline"
            className="bg-green-700"
            onClick={handleIncomingCall}
          >
           <PhoneIncoming/>
          </Button>
          <Button 
            variant="outline"
            className="bg-red-700"
            onClick={handleRejectCall}
          >
            <PhoneOff/>
          </Button>
          {/* <Toggle
            variant="outline"
            onClick={() =>
              myVideo
                ?.getVideoTracks()
                .forEach((track) => (track.enabled = !track.enabled))
            }
          >
            <VideoOff />
          </Toggle>
          <Button
            variant="outline"
            className="bg-red-700"
            onClick={handleEndCall}
          >
            <PhoneOff />
          </Button>
          <Toggle
            variant="outline"
            onClick={() =>
              myVideo
                ?.getAudioTracks()
                .forEach((track) => (track.enabled = !track.enabled))
            }
          >
            <MicOff />
          </Toggle> */}
        </CardFooter>
      </Card>
    </div>
  );
}
