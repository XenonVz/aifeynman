import { Link, useLocation } from "wouter";
import { User, AiPersona } from "@shared/schema";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  user: User | null;
  persona: AiPersona | null;
}

const Sidebar = ({ user, persona }: SidebarProps) => {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex md:flex-col bg-white dark:bg-gray-900 border-r border-neutral-200 dark:border-gray-800 w-72 overflow-y-auto shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold font-accent text-2xl text-primary-dark dark:text-white">Feynman Teacher</h1>
          <ThemeToggle />
        </div>
        <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">Learning through teaching</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-4">
        <div className="px-3 py-2 text-sm font-medium text-neutral-500 dark:text-gray-400">MAIN MENU</div>
        <Link href="/">
          <a className={`flex items-center px-6 py-3 ${location === "/" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-comment-alt w-5 mr-3 ${location === "/" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Teach AI</span>
          </a>
        </Link>
        <Link href="/sessions">
          <a className={`flex items-center px-6 py-3 ${location === "/sessions" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-history w-5 mr-3 ${location === "/sessions" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Sessions</span>
          </a>
        </Link>
        <Link href="/materials">
          <a className={`flex items-center px-6 py-3 ${location === "/materials" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-file-alt w-5 mr-3 ${location === "/materials" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Materials</span>
          </a>
        </Link>
        <Link href="/progress">
          <a className={`flex items-center px-6 py-3 ${location === "/progress" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-chart-bar w-5 mr-3 ${location === "/progress" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Progress</span>
          </a>
        </Link>
        
        {/* Current AI Profile */}
        {persona && (
          <>
            <div className="px-3 py-2 mt-6 text-sm font-medium text-neutral-500 dark:text-gray-400">CURRENT AI PROFILE</div>
            <div className="mx-6 p-4 bg-neutral-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center">
                <img
                  src={persona.avatarUrl}
                  alt="AI Avatar"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{persona.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-gray-400">
                    {persona.age} y/o • {persona.interests.slice(0, 2).join(" & ")}
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full py-1.5 px-3 text-xs bg-white dark:bg-gray-700 border border-neutral-300 dark:border-gray-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-600 text-neutral-700 dark:text-gray-200">
                Edit Profile
              </button>
            </div>
          </>
        )}
      </nav>
      
      {/* User Profile */}
      {user && (
        <div className="border-t border-neutral-200 dark:border-gray-800 p-4 mt-auto">
          <div className="flex items-center">
            <img
              src={user.avatarUrl}
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <p className="font-medium dark:text-white">{user.displayName}</p>
              <p className="text-xs text-neutral-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button className="text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
