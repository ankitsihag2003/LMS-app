import Login from './pages/login'
import Navbar from './components/ui/navbar'
import HeroSection from './pages/student/heroSection'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from './layout/mainLayout'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import EditProfile from './pages/student/EditProfile'
import Sidebar  from "./pages/admin/sidebar"
import CourseTable from './pages/admin/course/CourseTable'
import Dashboard from './pages/admin/Dashboard'
import AddCourse from './pages/admin/course/AddCourse'
import CourseEdit from './pages/admin/course/CourseEdit'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetails from './pages/student/CourseDetails'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminProtection, AuthenticatedUser, ProtectedRoute } from './components/ui/ProtectRoute'
import { CourseProgressProtect } from './components/ui/PurchaseCourseProtect'

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:(
          <>
          <HeroSection/>
          <Courses/>
          </>
        )
      },
      {
        path:"login",
        element:<AuthenticatedUser><Login/></AuthenticatedUser>
      },
      {
        path:"my-learning",
        element:<ProtectedRoute><MyLearning/></ProtectedRoute>
      },
      {
        path:"profile",
        element:<ProtectedRoute><EditProfile/></ProtectedRoute>
      },
      {
        path:"course-progress/:courseId",
        element:<ProtectedRoute><CourseProgressProtect><CourseProgress/></CourseProgressProtect></ProtectedRoute>
      },
      {
        path:"course-detail/:courseId",
        element:<ProtectedRoute><CourseDetails/></ProtectedRoute>
      },
      {
        path:"course/search",
        element:<ProtectedRoute><SearchPage/></ProtectedRoute>
      },
      // admin routes
      {
        path:"admin",
        element:<AdminProtection><Sidebar/></AdminProtection>,
        children:[
          {
            path:"Dashboard",
            element:<Dashboard/>
          },
          {
            path:"Courses",
            element:<CourseTable/>
          },
          {
            path:"Courses/create",
            element:<AddCourse/>
          },
          {
            path:"Courses/:courseId",
            element:<CourseEdit/>
          },
          {
            path:"Courses/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"Courses/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          }
        ]
      }
    ]
  }
])

function App() {

  return (
    <main>
      <RouterProvider router={appRouter}/>
    </main>
  )
}

export default App
