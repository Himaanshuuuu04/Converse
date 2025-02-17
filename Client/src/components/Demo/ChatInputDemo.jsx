
import { useSelector, useDispatch } from "react-redux";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { setMessageToSend, sendMessage } from "@/redux/slice/chatSlice";

export function ChatInputDemo() {
    const dispatch = useDispatch();
    const { messageToSend } = useSelector((state) => state.chat);
    const placeholders = [
        "Type your message here...",
        "Have a question? Ask away!",
        "Need help? Let's chat!",
        "Share your thoughts...",
        "Start chatting with..."
    ];

    const handleChange = (e) => {
        let message = e.target.value;
        dispatch(setMessageToSend({ text: message }));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        if (messageToSend.text.trim() === "" && !messageToSend.image) return;
        dispatch(sendMessage(messageToSend));
        dispatch(setMessageToSend({ text: "", image: "" }));
    };
    return (
        <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} className="w-full" />
    )
}
