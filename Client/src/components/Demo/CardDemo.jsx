import { BellRing, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

export const CardDemo = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { users, isUserLoading, selectedUser } = useSelector(state => state.chat);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch])
  return (
    <Card className={cn("w-[380px] h-full min-h-screen", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-center">Search Users</CardTitle>
        <CardDescription className="text-center">You can only search people ,whorm you follow</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
                "flex items-center space-x-4 rounded-md border py-2 px-4 w-full hover:bg-base-300 transition-colors",
                selectedUser?._id === user._id && "bg-base-300 ring-1 ring-base-300"
              )}
            >
              <img
                src={user.profileImage || defaultUserImage}
                alt={user.name}
                className="h-8 w-8 object-cover rounded-full"
              />
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
  )
};
