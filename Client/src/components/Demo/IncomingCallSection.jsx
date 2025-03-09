import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { PhoneOff } from 'lucide-react';
import { VideoOff } from 'lucide-react';
import { MicOff } from 'lucide-react';
import { useDispatch ,useSelector} from "react-redux";
import { endCall,generateCall,acceptCall,setIsCallOn } from "@/redux/slice/chatSlice";
import peer from "@/service/peer";
import { useCallback } from "react";
import {useToast} from "@/hooks/use-toast";

export default function IncomingCallSection() {
    const toast = useToast();
    const dispatch = useDispatch();
    const receiverSocketID = useSelector((state) => state.chat);
    const [myVideo, setMyVideo] = useState(null);
    const handleEndCall = () => {
        dispatch(endCall())
        dispatch(setIsCallOn(false));
    }

    
    const handleCallUser = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyVideo(stream);
            const offer = await peer.getOffer();
            dispatch(generateCall({toast,offer}));
        } catch (err) {
            console.log("Error in getting user media: ", err);
        }
    }, []);
    

    const handleIncomingCall = useCallback(async (offer) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMyVideo(stream);
            const answer = await peer.getAnswer(offer);
            dispatch(acceptCall({toast,answer}));
        } catch (err) {
            console.log("Error in getting user media: ", err);
        }
    }, []);

    useEffect(() => {
        handleCallUser();
        return () => {
            if (myVideo) {
                myVideo.getTracks().forEach(track => track.stop());
                setMyVideo(null);
            }
        }
    }, [handleCallUser]);

    return (
        <div className="flex items-center justify-center">
            <Card className="rounded-lg shadow-lg w-full relative">
                <CardHeader className="text-center py-4">
                    <CardTitle>Vansh Arora</CardTitle>
                    <CardDescription >Video Call</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex justify-center items-center p-4 ">
                    {/* Larger Video */}
                    <div className="w-5/6 h-full  rounded-xl overflow-hidden relative">
                        <ReactPlayer
                            url={myVideo}
                            playing
                            controls={false}
                            height={"90%"}
                            muted
                            width={"90%"}
                        />
                        {/* Smaller Video - Overlapping the Larger Video */}
                        <div className="absolute bottom-2 right-2 w-1/4 h-1/4 rounded-lg overflow-hidden shadow-lg border  bg-black " draggable="false" >
                            <ReactPlayer
                                url={myVideo}
                                playing
                                controls={false}
                                width="100%"
                                height="100%"
                                muted
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-6 items-center py-4 px-6">
                   
                    <Button variant="outline"><VideoOff /></Button> 
                    <Button variant="outline" className="bg-red-700" onClick={handleEndCall}><PhoneOff /></Button>
                    <Button variant="outline"><MicOff /></Button>
                </CardFooter>
            </Card>
        </div>
    );
}
