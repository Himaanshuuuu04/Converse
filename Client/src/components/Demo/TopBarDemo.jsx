import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { setSelectedUserdata } from "@/redux/slice/chatSlice"
import defaultUserImage from '../../assets/defaultUserImage.jpeg'
import { Video } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from 'lucide-react';
export default function TopBarDemo() {
    const dispatch = useDispatch();
    const { users, selectedUser,selectedUserData } = useSelector(state => state.chat);
    useEffect(() => {   
        if(selectedUser){
            const user = users.find((user) => user._id === selectedUser);
            if(user){
                dispatch(setSelectedUserdata(user));
            }
        }
    },[selectedUser]);
    
    return (
        <div className="flex items-center justify-between bg-black p-4 h-12 border border-collapse w-full sticky top-0 z-10">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={selectedUserData?.profileImage || defaultUserImage}
                    className="object-cover" />
                    <AvatarFallback>{selectedUserData?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <h1 className="text-white font-medium">{selectedUserData?.name || "User"}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Video className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
                <Phone className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
                <X className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors" />
            </div>
        </div>
    )
}