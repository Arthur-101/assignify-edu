
import { Button } from "./ui/button";
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { CheckCircle } from "lucide-react";

export function HeroSection() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  return (
    <section className="hero-gradient pt-28 pb-20 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Simplify Assignment Management with <span className="gradient-text">Assignify</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            A comprehensive platform for administrators, teachers, and students to streamline the assignment process from creation to evaluation.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-assignify-primary to-assignify-accent hover:from-assignify-accent hover:to-assignify-primary transition-all duration-300"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-assignify-primary text-assignify-primary hover:bg-assignify-light dark:border-assignify-accent dark:text-assignify-accent dark:hover:bg-assignify-dark"
            >
              Learn More
            </Button>
          </div>
          
          <div className="pt-6 flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-gray-700 dark:text-gray-300">Smart Assignment Evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-gray-700 dark:text-gray-300">Comprehensive Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-gray-700 dark:text-gray-300">Seamless Collaboration</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            <div className="w-full h-full absolute -top-4 -right-4 border-2 border-assignify-accent rounded-lg"></div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 relative z-10">
              <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-medium text-assignify-primary dark:text-assignify-accent">CS101: Introduction to Programming</div>
                  <div className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">Due in 3 days</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Submit your final project demonstrating your understanding of basic programming concepts.</div>
              </div>
              
              <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-medium text-assignify-primary dark:text-assignify-accent">MATH202: Linear Algebra</div>
                  <div className="text-sm px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full">Submitted</div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Your score: 92/100</div>
                <div className="mt-2 text-sm text-gray-500">Great work on eigenvalues section!</div>
              </div>
              
              <div className="text-center mt-6">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your Progress This Semester</div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-assignify-primary to-assignify-accent rounded-full" style={{width: "75%"}}></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">75% Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </section>
  );
}
