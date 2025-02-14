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

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
]

export const CardDemo = ({ className, ...props }) => (
  <Card className={cn("w-[380px]", className)} {...props}>
    <CardHeader>
      <CardTitle className="text-center">Search Users</CardTitle>
      <CardDescription className="text-center">You can only search people ,whorm you follow</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className="flex items-center space-x-4 rounded-md border py-2 px-4">
        <div className="flex space-y-1">
          <img src="https://i.pinimg.com/236x/ab/1f/e7/ab1fe7397baf85974c354889cb082d89.jpg" alt="" className="h-8 w-8 object-cover rounded-full"/>
        </div>
        <div className="flex flex-col justify-items-center">
          <span>Vansh  </span>
          <span className="text-xs text-muted-foreground">Online  </span>
        </div>
      </div>
      
    </CardContent>
    <CardFooter>
     
    </CardFooter>
  </Card>
);
