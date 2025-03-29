
import { Award, BookOpen, UserCog } from "lucide-react";

export function RolesSection() {
  const roles = [
    {
      icon: <UserCog size={48} className="text-assignify-primary" />,
      title: "Administrator",
      description: "Complete control over the system with tools to manage teachers, students, and batches.",
      features: [
        "Comprehensive user management",
        "Batch creation and organization",
        "System-wide analytics and reporting",
        "Access control and permissions",
        "Institution-level configurations"
      ]
    },
    {
      icon: <BookOpen size={48} className="text-assignify-secondary" />,
      title: "Teacher",
      description: "Powerful tools for assignment creation, evaluation, and student performance tracking.",
      features: [
        "Create and manage assignments",
        "Smart evaluation with AI assistance",
        "Performance tracking and insights",
        "Deadline management",
        "Batch and individual student analytics"
      ]
    },
    {
      icon: <Award size={48} className="text-assignify-accent" />,
      title: "Student",
      description: "Intuitive interface for assignment submission, feedback review, and progress tracking.",
      features: [
        "Easy assignment submission",
        "Progress tracking and analytics",
        "Performance comparisons",
        "Detailed feedback review",
        "Assignment history and organization"
      ]
    }
  ];
  
  return (
    <section id="roles" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tailored for Every Role
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Assignify offers specialized features for administrators, teachers, and students,
            ensuring everyone has the tools they need to succeed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden card-hover border border-gray-200 dark:border-gray-700"
            >
              <div className="p-8 text-center">
                <div className="inline-flex mb-6">{role.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{role.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{role.description}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-750 p-6">
                <ul className="space-y-3">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mt-0.5">
                        <svg className="h-4 w-4 text-green-500 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
