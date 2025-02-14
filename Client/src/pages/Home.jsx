import {Button} from "../components/ui/button";
import { CardDemo } from "../components/Demo/CardDemo";
export default function Home() {
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden bg-black">
                <CardDemo className={"w-[380px] bg-transparent p-0 min-h-screen rounded-none border-collapse border-y-0 "}/>
            </div>
            <div className="flex flex-col">
                
            </div>
            
        </div>
    );
}