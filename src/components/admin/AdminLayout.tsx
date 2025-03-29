
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart2, 
  BookOpen, 
  ChevronRight, 
  Home, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  User, 
  Users, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: Home,
  },
  {
    title: "Teachers",
    path: "/admin/teachers",
    icon: User,
  },
  {
    title: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    title: "Courses",
    path: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: BarChart2,
    disabled: true,
  },
  {
    title: "Messages",
    path: "/admin/messages",
    icon: MessageSquare,
    disabled: true,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const currentPage = sidebarItems.find((item) => 
    item.path === pathname || (pathname.startsWith(item.path) && item.path !== "/admin")
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar-background text-sidebar-foreground fixed md:relative z-30 flex flex-col h-full transition-all duration-300 shadow-lg",
          isSidebarOpen ? "w-64" : "w-0 md:w-20"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center gap-2 font-bold text-lg",
              !isSidebarOpen && "md:hidden"
            )}
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-assignify-primary to-assignify-accent flex items-center justify-center text-white">
              A
            </div>
            <span className="gradient-text">Assignify</span>
          </Link>
          
          <Link 
            to="/admin" 
            className={cn(
              "w-8 h-8 rounded-md bg-gradient-to-br from-assignify-primary to-assignify-accent items-center justify-center text-white hidden",
              !isSidebarOpen && "md:flex"
            )}
          >
            A
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <X size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.disabled ? "#" : item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                    pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground",
                    item.disabled && "opacity-50 pointer-events-none"
                  )}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      !isSidebarOpen && "md:hidden"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-2 mb-4",
            !isSidebarOpen && "md:justify-center"
          )}>
            <ThemeToggle />
            <span className={cn("text-sm", !isSidebarOpen && "md:hidden")}>
              Toggle theme
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-2",
              !isSidebarOpen && "md:hidden"
            )}>
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                {user?.name?.charAt(0) || user?.email.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.email}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className={cn(
                "text-sidebar-foreground hover:text-sidebar-accent-foreground",
                !isSidebarOpen && "md:w-full"
              )}
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              <Menu size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">
                {currentPage?.title || "Dashboard"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
