import {Button} from "../components/ui/button";
import { CardDemo } from "../components/Demo/CardDemo";
export default function Home() {
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                <div className="mt-10l-5 flex flex-col  mr-10">
                    <CardDemo className={"w-[380px] bg-black p-0 min-h-screen rounded-none "}/>
                </div>
            </div>
            
        </div>
    );
}