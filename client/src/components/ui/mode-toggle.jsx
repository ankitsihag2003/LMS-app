// src/components/ui/mode-toggle.jsx
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

const ModeToggle = () => {
  const [theme, setTheme] = React.useState(() =>
    localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export { ModeToggle };
