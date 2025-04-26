import { useState , useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useGetUserQuery, useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import {toast} from "sonner";
import { useNavigate } from "react-router-dom"

const Login=()=> {
  const [signupInput, setsignupInput] = useState({name:"",email:"",password:""})
  const [loginInput, setloginInput] = useState({email:"",password:""})

  const [registerUser,{data:registerData , error:registerError , isLoading:registerIsLoading , isSuccess:registerIsSuccess}] = useRegisterUserMutation();
  const [loginUser , {data:loginData , error:loginError , isLoading:loginIsLoading , isSuccess:loginIsSuccess}] = useLoginUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Registration successful.");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Sign up failed.");
    }
  }, [registerIsSuccess, registerData, registerError]);

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Logged in.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Sign in failed.");
    }
  }, [loginIsSuccess, loginData, loginError]);
  
  const handleSubmit=async (type)=>{
    const inputData = (type === "signup") ? signupInput : loginInput;
    if(type === "signup"){
      await registerUser(inputData)
    }else{
      await loginUser(inputData);
    }
  }

  const handleInput=(e,type)=>{
      const {name,value} = e.target;
      if(type === "signup"){
        setsignupInput({...signupInput,[name]:value})
      }else{
        setloginInput({...loginInput,[name]:value})
      }
  }
  return (
    <div className="flex w-full justify-center h-[100vh] items-center">
        <Tabs defaultValue="login" className="sm:mx-[10px] w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
            <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={loginInput.email} onChange={(e)=>handleInput(e,"login")} type="email" placeholder="Eg. abc@gmail.com" required={true} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" value={loginInput.password} onChange={(e)=>handleInput(e,"login")} type="password" placeholder="Enter your password" required={true} />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={loginIsLoading} onClick={()=>handleSubmit("login")} className="cursor-pointer">
                  {
                    loginIsLoading ?
                    <><Loader2 className="animate-spin"/>Please Wait</>: "login"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                Create a new account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={signupInput.name} onChange={(e)=>handleInput(e,"signup")} type="text" required={true} placeholder="Eg. ankit"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={signupInput.email} onChange={(e)=>handleInput(e,"signup")} type="email" placeholder="Eg. abc@gmail.com" required={true} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" value={signupInput.password} onChange={(e)=>handleInput(e,"signup")} type="password" placeholder="Enter your password" required={true} />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={registerIsLoading} onClick={()=>handleSubmit("signup")} className="cursor-pointer">
                  {
                    registerIsLoading ?
                    <><Loader2 className="animate-spin"/>Please Wait</>: "Sign Up"
                  }
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
export default Login;

