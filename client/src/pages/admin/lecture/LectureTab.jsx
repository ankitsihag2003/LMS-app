import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDeleteCourseLectureMutation, useEditCourseLectureMutation, useGetLectureByIdQuery } from '@/features/api/courseApi';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';


const MEDIA_URL = "https://lms-app-backend-qmqx.onrender.com/media";

const LectureTab = () => {
    const params = useParams();
    const courseId = params.courseId;
    const lectureId = params.lectureId;
    const navigate = useNavigate();

    const [Title, setTitle] = useState("");
    const [mediaProgress, setmediaProgress] = useState(false);
    const [videoUploadInfo, setvideoUploadInfo] = useState(null);
    const [IsFree, setIsFree] = useState(false);
    const [UploadProgress, setUploadProgress] = useState(0);
    const [BtnDisable, setBtnDisable] = useState(true);

    const [editCourseLecture,{data,isLoading,error,isSuccess}] = useEditCourseLectureMutation();
    const [deleteCourseLecture,{data:removeLectureData,isLoading:isDeleting,error:errorDeleting,isSuccess:deleteSuccess}] = useDeleteCourseLectureMutation();
    const {data:lectureData} = useGetLectureByIdQuery(lectureId);
    
    const lecture = lectureData?.lecture; 

    const fileChangeHandler = async (e)=>{
        const file = e.target.files[0];
        if(file){
            const formData = new FormData();
            formData.append("file",file);
            setmediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_URL}/video-upload`,formData,{
                    onUploadProgress : ({loaded,total})=>{
                        setUploadProgress(Math.round((loaded*100)/total));
                    }
                });
                if(res.data.success){
                    setvideoUploadInfo({videoUrl:res.data.data.url,publicId:res.data.data.public_id});
                    setBtnDisable(false);
                    toast.success(res.data.message || "Video uploaded successfully!");
                }
            } catch (error) {
                console.log(error);
                toast.error("Video upload failed!");
            }finally{
                setmediaProgress(false);
            }
        }
    }
    const handleSubmit = async (e)=>{
        await editCourseLecture({courseId,lectureId,lectureTitle:Title,videoInfo:videoUploadInfo,IsFree})
    }
    const handleRemoveLecture = async ()=>{
        await deleteCourseLecture(lectureId);
    }
    
    useEffect(() => {
        if(lecture){
            setTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setvideoUploadInfo(lecture.videoUrl ? {videoUrl:lecture.videoUrl,publicId:lecture.publicId} :null);
        }
    }, [lecture])
    

    useEffect(() => {
      if(isSuccess){
        toast.success(data.message || "Lecture updated successfully!");
        navigate(-1);
      }
      if(error){
        toast.error(error.data.message);
      }
    }, [error,isSuccess])

    useEffect(() => {
      if(deleteSuccess){
        toast.success(removeLectureData.message);
        navigate(-1);
      }
      if(errorDeleting){
        toast.error(errorDeleting.data.message);
      }
    }, [deleteSuccess,errorDeleting])
    
    
    return (
        <Card className="w-full max-w-2xl dark:bg-gray-900 bg-white rounded-xl shadow-md">
            <CardContent className="px-6 py-2 space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-lg font-semibold">Edit Lecture</h2>
                    <p className="text-sm text-muted-foreground">
                        Make changes and click save when done.
                    </p>
                </div>

                {/* Remove Button */}
                <Button variant="destructive" className="cursor-pointer" onClick={()=>handleRemoveLecture()}>
                    {isDeleting ? (
                        <>
                        <Loader2 className='mr-4 h-4 w-4 animate-spin'/><span>Removing...</span>
                        </>
                    ) : "Remove Lecture"
                    }
                </Button>

                {/* Title Input */}
                <div className="space-y-1">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        name="Title"
                        placeholder="Lecture title"
                        value={Title}
                        onChange={(e)=>setTitle(e.target.value)}
                    />
                </div>

                {/* Video Upload */}
                <div className="space-y-1">
                    <Label htmlFor="video" className="flex items-center gap-1">
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        disabled={mediaProgress}
                        onChange={(e)=>fileChangeHandler(e)}
                    />
                </div>
                {mediaProgress && (
                    <div className='my-4'>
                        <Progress value={UploadProgress}/>
                        <p>{UploadProgress}% uploaded</p>
                    </div>
                )}

                {/* Toggle */}
                <div className="flex items-center space-x-2">
                    <Switch id="isFree" checked={IsFree} onCheckedChange={(checked)=>setIsFree(checked)} />
                    <Label htmlFor="isFree">Is this video FREE?</Label>
                </div>

                {/* Update Button */}
                <Button
                    className="w-fit cursor-pointer"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? (
                        <>
                        <Loader2 className='mr-4 h-4 w-4 animate-spin'/><span>Updating...</span>
                        </>
                    ) : "Update Lecture"}
                </Button>
            </CardContent>
        </Card>
    )
}

export default LectureTab
