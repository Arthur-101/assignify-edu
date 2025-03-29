
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoginModal } from "./LoginModal";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="py-4 px-4 md:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-assignify-primary to-assignify-accent flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-bold gradient-text">Assignify</span>
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8">
            <li><a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent transition-colors">Features</a></li>
            <li><a href="#roles" className="text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent transition-colors">Roles</a></li>
            <li><a href="#workflow" className="text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent transition-colors">Workflow</a></li>
          </ul>
          <Button onClick={() => setIsLoginModalOpen(true)}>Login</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-[300px] py-4" : "max-h-0"
      )}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col gap-4 mb-4">
            <li><a href="#features" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent" onClick={toggleMenu}>Features</a></li>
            <li><a href="#roles" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent" onClick={toggleMenu}>Roles</a></li>
            <li><a href="#workflow" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-assignify-primary dark:hover:text-assignify-accent" onClick={toggleMenu}>Workflow</a></li>
          </ul>
          <Button className="w-full mb-4" onClick={() => {
            setIsLoginModalOpen(true);
            setIsMenuOpen(false);
          }}>Login</Button>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}
