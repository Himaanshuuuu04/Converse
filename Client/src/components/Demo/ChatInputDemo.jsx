import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export function ChatInputDemo() {
    const placeholders = [
        "Type your message here...",
        "Have a question? Ask away!",
        "Need help? Let's chat!",
        "Share your thoughts...",
        "Start chatting with..."
    ];

    const handleChange = (e) => {
        console.log(e.target.value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        console.log("submitted");
    };
    return (
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} className="w-full"/>
    )
}
