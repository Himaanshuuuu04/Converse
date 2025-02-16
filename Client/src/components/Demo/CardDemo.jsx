import {  ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContextMenuDemo } from "./ContextMenuDemo";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "@/redux/slice/chatSlice";
import { useEffect } from "react";
import defaultUserImage from "../../assets/defaultUserImage.jpeg";
import { Input } from "../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CardDemo = ({ className, ...props }) => {
  const dispatch = useDispatch();
  const { users, selectedUser } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <Card className={cn("md:w-[380px] w-screen", className)} {...props}>
      <div className="sticky top-0 z-10 bg-black">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Search Users</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            You can only search people you follow
          </CardDescription>
          <div className="flex items-center space-x-2">
          <Input
            placeholder="Aunt May..."
            className="w-full"
            aria-label="Search users"
          />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>

                    
                    <Button variant="outline">
                      <Search />
                    </Button>
              
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
      </div>
      <CardContent className="grid gap-0 p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          {users.length === 0 ? (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          ) : (
            users.map((user) => (
              <ContextMenuDemo key={user._id}>
                <button
                  onClick={() => dispatch(setSelectedUser(user._id))}
                  className={cn(
                    "flex items-center border border-collapse space-x-4 py-3 px-4 w-full hover:bg-base-300 transition-colors",
                    selectedUser === user._id ? "bg-white/10" : "bg-black"
                  )}
                >
                  <Avatar>
                    <AvatarImage
                      src={user.profileImage || defaultUserImage}
                      className="object-cover"
                    />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start flex-1">
                    <span>{user.fullName}</span>
                    <span className="text-xs text-lime-400 text-muted-foreground">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  </div>
                </button>
              </ContextMenuDemo>
            ))
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
};
