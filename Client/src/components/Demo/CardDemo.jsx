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
import { Input } from "../ui/input"
import { map } from "zod"
import { ChevronRight } from 'lucide-react';


export const CardDemo = ({ className, ...props }) => (
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
    
    <CardContent className="grid gap-2 border p-2">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 rounded-md  py-2 px-4">
      <div className="flex space-y-1">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </div>
      <div className="flex flex-col justify-items-center">
        <span>Vansh  </span>
        <span className="text-xs text-muted-foreground">Online  </span>
      </div>
      <ChevronRight className=""/>
    </div>
    
    ))}
      
    </CardContent>
    <CardFooter>
     
    </CardFooter>
  </Card>
);
