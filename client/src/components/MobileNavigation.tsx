import { Link, useLocation } from "wouter";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <nav className="md:hidden bg-white border-t border-neutral-200 flex justify-around py-2">
      <Link href="/">
        <a className={`flex flex-col items-center py-1 px-3 ${location === "/" ? "text-primary" : "text-neutral-500"}`}>
          <i className="fas fa-comment-alt"></i>
          <span className="text-xs mt-1">Teach</span>
        </a>
      </Link>
      <Link href="/sessions">
        <a className={`flex flex-col items-center py-1 px-3 ${location === "/sessions" ? "text-primary" : "text-neutral-500"}`}>
          <i className="fas fa-history"></i>
          <span className="text-xs mt-1">Sessions</span>
        </a>
      </Link>
      <Link href="/materials">
        <a className={`flex flex-col items-center py-1 px-3 ${location === "/materials" ? "text-primary" : "text-neutral-500"}`}>
          <i className="fas fa-file-alt"></i>
          <span className="text-xs mt-1">Materials</span>
        </a>
      </Link>
      <Link href="/progress">
        <a className={`flex flex-col items-center py-1 px-3 ${location === "/progress" ? "text-primary" : "text-neutral-500"}`}>
          <i className="fas fa-chart-bar"></i>
          <span className="text-xs mt-1">Progress</span>
        </a>
      </Link>
    </nav>
  );
};

export default MobileNavigation;
