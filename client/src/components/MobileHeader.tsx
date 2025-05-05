import { User, AiPersona } from "@shared/schema";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

interface MobileHeaderProps {
  user: User | null;
  persona: AiPersona | null;
}

const MobileHeader = ({ user, persona }: MobileHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 p-4 flex justify-between items-center md:hidden shadow-sm">
      <div className="flex items-center space-x-3">
        <img 
          src={user?.avatarUrl || ""}
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div>
          <h1 className="font-bold font-accent text-lg">Feynman Teacher</h1>
          <span className="text-xs text-neutral-500">Learning through teaching</span>
        </div>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <button className="text-neutral-500 hover:text-neutral-700 p-2">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar user={user} persona={persona} />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileHeader;
