import {Button} from "../components/ui/button";
import { CardDemo } from "../components/Demo/CardDemo";
export default function Home() {
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                <div className="mt-10l-5 mb-10 flex flex-col gap-5 mr-10">
                    <CardDemo/>
                </div>
            </div>
            
        </div>
    );
}