import { FaTachometerAlt, FaBookOpen, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt className="text-xl" />,
    },
    {
      name: "Courses",
      icon: <FaBookOpen className="text-xl" />,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="flex">
        <div
          className={`fixed left-0 z-40 w-64 min-h-screen bg-gray-100 dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        top-16  // offset for navbar (h-16 = 64px)
        lg:top-0 lg:translate-x-0 lg:static lg:shadow-none`}
        >
          <div className="p-6">
            <ul className="space-y-5 mt-4">
              {links.map((link, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                ><Link to={`/admin/${link.name}`} className="flex items-center gap-4">{link.icon}
                    <span className="text-md font-medium">{link.name}</span></Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Floating toggle button (mobile only) */}
        <div className="lg:hidden fixed bottom-6 left-6 z-50 group">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-gray-300 dark:text-black">
              {isOpen ? "Close Menu" : "Open Menu"}
            </span>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
