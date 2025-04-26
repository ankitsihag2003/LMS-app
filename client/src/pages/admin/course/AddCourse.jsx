import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateCourseMutation } from "@/features/api/courseApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const AddCourse=() =>{
    const navigate = useNavigate();
    const [CourseTitle, setCourseTitle] = useState("");
    const [Category, setCategory] = useState("");

    const [createCourse,{data,isSuccess,error,isLoading}] = useCreateCourseMutation();

    const courseHander = (e) => {
        setCourseTitle(e.target.value);
    }    
    const categoryHandler = (value) => {
        setCategory(value);
    }   
    const courseSubmitHandler = async () => {
        await createCourse({courseTitle:CourseTitle,Category:Category});
    } 
    
    useEffect(() => {
      if(isSuccess) {
        toast.success(data.message||"Course Created Successfully!");
        navigate("/admin/Courses");
      }
      if(error) {
        toast.error(error.data.message||"Course Creation Failed!");
      }
    }, [isSuccess, error])
    

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full min-h-[calc(100vh-4rem)] dark:bg-gray-900 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight mb-2 dark:text-white">
          Let's add course, add some basic details for your new course
        </h2>
        <p className="text-muted-foreground mb-6 dark:text-gray-400">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>

        <div className="grid gap-6">
          <div>
            <Label htmlFor="title" className="dark:text-gray-200">Title</Label>
            <Input
              id="title"
              placeholder="Your Course Name"
              Input={CourseTitle}
              onChange={(e)=>courseHander(e)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="dark:text-gray-200">Category</Label>
            <Select onValueChange={(value)=>categoryHandler(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full Stack Developmen">Full Stack Development</SelectItem>
                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                <SelectItem value="Game Development">Game Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                <SelectItem value="Natural Language Processing">Natural Language Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={()=>navigate("/admin/Courses")}>Cancel</Button>
            <Button onClick={courseSubmitHandler} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin">Creating...</Loader2> : "Create Course"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCourse;
