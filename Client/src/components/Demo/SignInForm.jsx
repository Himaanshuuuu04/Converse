import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { signup, verifyOTP } from "@/redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Enter a valid full name." }),
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignInForm() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data) => {
    try {
      const response = await dispatch(signup(data)).unwrap();
      if (response?.message === "OTP sent to email") {
        toast({ title: "Success", description: "OTP sent to your email.", variant: "success" });
        setShowOtp(true);
      } else {
        toast({ title: "Error", description: response?.message || "Failed to send OTP.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const email = form.getValues("email");
      const response = await dispatch(verifyOTP({ email, otp })).unwrap();
      if (response?.message === "Email verified successfully") {
        toast({ title: "Success", description: "Email verified successfully!", variant: "success" });
        navigate("/login"); // Redirect after successful verification
      } else {
        toast({ title: "Error", description: response?.message || "Invalid OTP.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleError = (errors) => {
    const errorMessages = Object.values(errors)
      .map((err) => err.message)
      .join("\n");
    toast({
      title: "Validation Error",
      description: errorMessages,
      variant: "destructive",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, handleError)} className="space-y-5">
        {/* Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        {!showOtp && <Button type="submit" className="w-full">Submit</Button>}

        {/* OTP Input Section */}
        {showOtp && (
          <div className="space-y-5">
            <FormItem>
              <FormLabel>Enter OTP</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    {[...Array(3)].map((_, i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[...Array(3)].map((_, i) => <InputOTPSlot key={i + 3} index={i + 3} />)}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Verify OTP Button */}
            <Button type="button" className="w-full" onClick={handleVerifyOTP}>
              Verify OTP
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
