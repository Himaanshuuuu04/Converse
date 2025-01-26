import {Button} from "../components/ui/button";

export default function Home() {
    return (
        <div className="h-screen w-screen bg-black">
            <h1 className="text-red-500">Home</h1>
            
            <Button variant="destructive">Login</Button>
        </div>
    );
}