import { useState, useRef } from "react";
import { ChatInputDemo } from "./ChatInputDemo";
import { ImagePlus, Send, Brain, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { sendMessage, setMessageToSend,getAiResponse } from "@/redux/slice/chatSlice";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "../ui/scroll-area";

export default function LowerBarDemo() {
    const dispatch = useDispatch();
    const { messageToSend,aiResponse,aiLoading } = useSelector((state) => state.chat);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setImageFile(file);
        } else {
            console.log("No file selected");
        }
    };
    const handleSendMessage = () => {
        if (!messageToSend.text.trim() && !imageFile) return;
        const formData = new FormData();
        formData.append("text", messageToSend.text);
        if (imageFile) {
            formData.append("file", imageFile);
        }
        if (messageToSend?.audio) {
            formData.append("audio", messageToSend.audio);
        }
        dispatch(sendMessage(formData));
        setSelectedImage(null);
        setImageFile(null);
        fileInputRef.current.value = "";
        dispatch(setMessageToSend({ text: "", audio: null }));
    };
    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAiResponse = () => {
        dispatch(getAiResponse({ userInput : messageToSend.text }));
    }

    return (
        
        <div className="flex items-center bg-black p-4 h-16 border-t w-full sticky bottom-0">
            <div className="flex items-center space-x-4 w-full">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <label className="cursor-pointer relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0"
                                    onChange={handleImageUpload}
                                />
                                <Button variant="outline">
                                    <ImagePlus className="w-5 h-5 hover:text-gray-300 transition-colors" />
                                </Button>
                            </label>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Upload image</p>
                        </TooltipContent>
                    </Tooltip>

                    <ChatInputDemo />
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" onClick={handleAiResponse}>
                                <Brain className="w-5 h-5 hover:text-gray-300 transition-colors" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" sideOffset={20} className="w-96 p-4 shadow-md">
                            <h1 className="font-semibold text-xl">AI Generated</h1>
                            <ScrollArea className="max-h-80">
                                <div className="font-extralight">
                                    {aiLoading ? "Loading" : <ReactMarkdown>{aiResponse}</ReactMarkdown>}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>

                    
                    


                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" onClick={handleSendMessage}>
                                <Send className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Send</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {selectedImage && (
                <div className="absolute bottom-20 left-4 p-2 bg-white rounded-lg shadow-lg ">
                    <button
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full hover:bg-red-500 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                    />
                </div>
            )}
        </div>
       
    );
}