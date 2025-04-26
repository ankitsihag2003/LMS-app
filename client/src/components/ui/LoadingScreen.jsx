import React from "react";
import { Loader2 } from "lucide-react";

const LoadingScreen = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingScreen;