import { ChatInputDemo } from "./ChatInputDemo";
import { ImagePlus, Send, Brain } from 'lucide-react';
import { Button } from "../ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function LowerBarDemo() {
    return (
        <div className="flex items-center bg-black p-4 h-16 border-t w-full sticky bottom-0">
            <div className="flex items-center space-x-4 w-full">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">
                                <ImagePlus className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Upload image</p>
                        </TooltipContent>
                    </Tooltip>
                    <ChatInputDemo />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">
                                <Brain className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Get AI suggestions</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">
                                <Send className="w-5 h-5 cursor-pointer hover:text-gray-300 transition-colors" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Send</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
