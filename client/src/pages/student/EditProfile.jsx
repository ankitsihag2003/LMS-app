import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";

import React, { useState, useEffect } from 'react'
import Course from "./Course";
import { useGetUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const EditProfile = () => {
    const [name, setname] = useState("");
    const [profilePhoto, setprofilePhoto] = useState("")
    const [Role, setRole] = useState("")

    const { data, isLoading, error, refetch } = useGetUserQuery();
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isSuccess: updateUserIsSuccess, isError: updateUserIsError, error: updateUserError }] = useUpdateUserMutation();

    const onChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setprofilePhoto(file);
        }
    }
    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("roles", Role);
        if (profilePhoto) {
            formData.append("profilePhoto", profilePhoto);
        }
        await updateUser(formData);
    }

    useEffect(() => {
        refetch();
    }, [])

    useEffect(() => {
        if (updateUserIsSuccess) {
            refetch();
            toast.success(updateUserData?.message || "Profile updated successfully!");
        }
        if (updateUserIsError) {
            toast.error(updateUserError?.message || "Failed to update profile!");
        }
    }, [updateUserData, updateUserIsLoading, updateUserIsSuccess, updateUserIsError])


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8" />
                <span className="ml-2">Loading profile...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error fetching profile: {error.status}</div>;
    }

    if (!data || !data.user) {
        return <div className="text-yellow-500">No user data found</div>;
    }

    const user = data && data.user;

    return (
        <div className="px-8 lg:px-32 py-10">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

            <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar */}
                <div>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoUrl || "/default-avatar.png"} />
                        <AvatarFallback className="bg-gray-200 text-black">{user.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Profile Details and Dialog */}
                <div className="flex flex-col space-y-3">
                    <h1 className="font-semibold text-sm">
                        Name: <span className="font-normal">{user.name}</span>
                    </h1>
                    <h1 className="font-semibold text-sm">
                        Email: <span className="font-normal">{user.email}</span>
                    </h1>
                    <h1 className="font-semibold text-sm">
                        Role: <span className="font-normal">{user.roles.toUpperCase()}</span>
                    </h1>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-fit mt-2 cursor-pointer">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        className="col-span-3 border rounded px-2 py-1"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="avatar" className="text-right">
                                        Avatar
                                    </label>
                                    <div className="col-span-3">
                                        <label
                                            htmlFor="avatar"
                                            className="cursor-pointer bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm font-medium inline-block hover:bg-blue-200 transition"
                                        >
                                            Choose File
                                            <input
                                                type="file"
                                                id="avatar"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={onChangeHandler}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="role" className="text-right">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        className="col-span-3 border rounded px-2 py-1"
                                        value={Role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={updateUserIsLoading} onClick={updateUserHandler} type="submit">
                                    {
                                        updateUserIsLoading ?
                                            <><Loader2 className="animate-spin" />Please Wait</> : "Save"
                                    }
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Courses Section */}
            <div className="mt-12 px-2">
                <h2 className="text-lg font-semibold mb-4">Courses You Are Enrolled In</h2>
                {/* Your enrolled courses component goes here */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {user.enrolled_courses.length == 0 ?
                        <p className='font-semibold'>You haven't enrolled yet.</p> :
                        user.enrolled_courses.map((course) => <Course course={course} key={course._id} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default EditProfile