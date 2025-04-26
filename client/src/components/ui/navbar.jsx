import React, { useState,useEffect, use } from "react";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state => state.auth.user));
  let role = "instructor";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [logoutUser,{data,isSuccess}] = useLogoutUserMutation();
  const navigate = useNavigate();


  const handleLogout = async () => {
    const response = await logoutUser();
  }
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  

  return (
    <nav className="h-16 flex items-center justify-between px-4 py-2 border-b bg-background text-foreground shadow-sm sticky top-0 z-50">
      {/* Logo and Hamburger */}
      <div className="flex items-center space-x-2">
        <button
          className="md:hidden mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <img
          src="/lms-logo.png"
          alt="Logo Light"
          className="h-8 w-8 block dark:hidden"

        />
        <img
          src="/lms-logo-dark.png"
          alt="Logo Dark"
          className="h-8 w-8 hidden dark:block"
         
        />
        <Link to="/"><span className="text-xl font-bold tracking-tight whitespace-nowrap">
          ElevateLearn
        </span></Link>
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center space-x-4">
        <ModeToggle />
        {!user && (
          <>
            <Button className="text-foreground bg-background hover:bg-muted cursor-pointer" onClick={()=>navigate("/login")}>
              Login
            </Button>
            <Button className="bg-background text-foreground hover:bg-muted cursor-pointer" onClick={()=>navigate("/login")}>
              Sign Up
            </Button>
          </>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src= {user?.photoUrl||"/default-avatar.png"} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem className="cursor-pointer"><Link to="/my-learning">My Learning</Link></DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer"><Link to="/profile">Edit Profile</Link></DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
              {user.roles==="instructor" && (
                <DropdownMenuItem className="cursor-pointer"><Link to="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-t shadow-md px-4 py-5 md:hidden z-40">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">E-Learning</span>
            <ModeToggle />
          </div>
          <div className="flex flex-col space-y-2">
            {!user && (
              <>
                <Button className="text-foreground bg-background hover:bg-muted cursor-pointer w-full" onClick={()=>navigate("/login")}>
                  Login
                </Button>
                <Button className="bg-background text-foreground hover:bg-muted cursor-pointer w-full" onClick={()=>navigate("/login")}>
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <>
                <Button variant="ghost" className="w-full text-left"><Link to="/my-learning">My Learning</Link></Button>
                <Button variant="ghost" className="w-full text-left"><Link to="/profile">Edit Profile</Link></Button>
                <Button variant="ghost" className="w-full text-left" onClick={handleLogout}>Log out</Button>
                {user.roles==="instructor" && (
                <Button variant="ghost" className="w-full text-left" onClick={()=>navigate("/admin/dashboard")}>
                  Dashboard
                </Button>
              )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
