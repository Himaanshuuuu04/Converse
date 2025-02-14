import { BellRing, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, setSelectedUser } from "@/redux/slice/chatSlice"
import { useEffect } from "react"
import defaultUserImage from '../../assets/defaultUserImage.jpeg'
import { Input } from "../ui/input"

export const CardDemo = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { users, isUserLoading, selectedUser } = useSelector(state => state.chat);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">
        Search Users
      </CardTitle>
      <CardDescription className="text-xs  text-muted-foreground">
        You can only search people you follow
      </CardDescription>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Aunt May..."
          className="w-full"
          aria-label="Search users"
        />
        <Button variant="outline" >
          Search
        </Button>
      </div>
    </CardHeader>
    
    <CardContent className="grid gap-2 border-collapse border border-x-0 p-2">
    {isUserLoading ? (
          <div className="text-center text-zinc-500 py-4">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        ) : (
    users.map((user) => (
      <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user._id))}
              className={cn(
                "flex items-center space-x-4 py-2 px-4 w-full hover:bg-base-300 transition-colors hover:bg-white/5",
                selectedUser?._id === user._id && "bg-base-300 ring-1 ring-base-300"
              )}
            >
              <Avatar>
                <AvatarImage src={user.profileImage || defaultUserImage} className="object-cover"/>
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span>{user.fullName}</span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </button>
    
    ))
        )}  
      
    </CardContent>
    <CardFooter>
     
    </CardFooter>
  </Card>
)};
