import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import defaultUserImage from "../../assets/defaultUserImage.jpeg";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Camera, User, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slice/authSlice";

const formSchema = z.object({
    fullName: z.string().min(2, { message: "Enter the full name for Signin." }).optional(),
    about: z.string().optional(),
    profileImage: z.any().optional(),
});

export function UpdateForm() {
    const dispatch = useDispatch();
    const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
    const [previewImage, setPreviewImage] = useState(authUser?.profileImage || defaultUserImage);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: authUser?.fullName || "",
            about: authUser?.about || "",
        },
    });
    useEffect(() => {
        if (authUser) {
            form.reset({
                fullName: authUser.fullName || "",
                about: authUser.about || "",
            });
            setPreviewImage(authUser?.profileImage || defaultUserImage);
        }
    }, [authUser]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreviewImage(URL.createObjectURL(file));
        form.setValue("profileImage", file);
    };

    const handleSubmit = (data) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('about', data.about);
        if (data.profileImage) {
            formData.append('profileImage', data.profileImage);
        }
        dispatch(updateProfile(formData));
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center dark bg-black text-white">
            <div className="w-full max-w-sm border-white/20 border px-8 py-6 rounded-xl backdrop-filter backdrop-blur-sm">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-semibold">Update Your Profile</h1>
                    <p className="mt-2 text-sm">Edit your details below and save changes.</p>
                </div>

                {/* Profile Image Upload */}
                <div className="flex flex-col items-center gap-4 mt-6">
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-gray-600 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                        >
                            <Camera className="w-5 h-5 text-white" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <User className="w-4 h-4 inline-block mr-2" />
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="about"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <FileText className="w-4 h-4 inline-block mr-2" />
                                        About
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
