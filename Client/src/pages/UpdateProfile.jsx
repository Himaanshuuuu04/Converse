import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slice/authSlice";
import { Camera, Mail, User } from "lucide-react";
import { SheetSide } from "../Components/Demo/SheetDemo";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);
    const [profileImage, setProfileImage] = useState(authUser?.profileImage || null);
    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [about, setAbout] = useState(authUser?.about || "");

    useEffect(() => {
        setProfileImage(authUser?.profileImage || null);
        setFullName(authUser?.fullName || "");
        setAbout(authUser?.about || "");
    }, [authUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result;
            setProfileImage(base64Image);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        const data = {
            profileImage,
            fullName,
            about,
        };

        dispatch(updateProfile(data)); // Dispatch updateProfile action
    };

    return (
        <div className="h-screen bg-black pt-20 flex items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white/10 rounded-lg shadow-lg">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-semibold">Update Your Profile</h1>
                    <p className="mt-2 text-sm">Make changes to your profile below.</p>
                </div>

                {/* Avatar upload section */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    <div className="relative">
                        <img
                            src={profileImage || "/avatar.png"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className={`
                                absolute bottom-0 right-0 
                                bg-gray-600 hover:scale-105 
                                p-2 rounded-full cursor-pointer 
                                transition-all duration-200
                                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                            `}
                        >
                            <Camera className="w-5 h-5 text-white" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                    <p className="text-sm text-gray-400">
                        {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                    </p>
                </div>

                {/* Editable Fields */}
                <div className="space-y-6 mt-6">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </div>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="px-4 py-2.5 bg-gray-700 rounded-lg border w-full text-white"
                            disabled={isUpdatingProfile}
                        />
                    </div>

                    {/* About */}
                    <div className="space-y-1.5">
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            About
                        </div>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="px-4 py-2.5 bg-gray-700 rounded-lg border w-full text-white"
                            disabled={isUpdatingProfile}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        className={`btn w-full ${isUpdatingProfile ? "btn-disabled" : "btn-primary"}`}
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
