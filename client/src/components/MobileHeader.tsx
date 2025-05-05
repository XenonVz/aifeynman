import { User, AiPersona } from "@shared/schema";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

interface MobileHeaderProps {
  user: User | null;
  persona: AiPersona | null;
}

const MobileHeader = ({ user, persona }: MobileHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-800 p-4 flex justify-between items-center md:hidden shadow-sm">
      <div className="flex items-center space-x-3">
        <img 
          src={user?.avatarUrl || ""}
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div>
          <h1 className="font-bold font-accent text-lg dark:text-white">Feynman Teacher</h1>
          <span className="text-xs text-neutral-500 dark:text-gray-400">Learning through teaching</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeToggle className="mr-1" />
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="text-neutral-500 hover:text-neutral-700 dark:text-gray-400 dark:hover:text-gray-300 p-2">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 dark:bg-gray-900 dark:border-gray-800">
            <Sidebar user={user} persona={persona} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileHeader;
