
import { Bot, Calendar, CheckCircle, FileCheck, FileText, PieChart, Settings, Upload, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: <FileText />,
      title: "Smart Assignment Creation",
      description: "Create detailed assignments with rubrics, deadlines, and batch selection."
    },
    {
      icon: <Upload />,
      title: "Easy Submission",
      description: "Students can submit assignments in various formats including PDFs, documents, and more."
    },
    {
      icon: <Bot />,
      title: "AI-Powered Evaluation",
      description: "Automatic evaluation with text matching and NL-based assessment with customizable rubrics."
    },
    {
      icon: <FileCheck />,
      title: "Manual Grading Option",
      description: "Teachers can choose to manually grade submissions with intuitive tools."
    },
    {
      icon: <PieChart />,
      title: "Comprehensive Analytics",
      description: "Track student performance, batch comparisons, and identify trends over time."
    },
    {
      icon: <Calendar />,
      title: "Deadline Management",
      description: "Set, track, and adjust deadlines with automatic notifications."
    },
    {
      icon: <CheckCircle />,
      title: "Performance Insights",
      description: "Generate personalized reports highlighting strengths and improvement areas."
    },
    {
      icon: <Settings />,
      title: "Customizable Workflow",
      description: "Adapt the system to your institution's specific needs and processes."
    }
  ];
  
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Educational Excellence
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Assignify provides a comprehensive suite of tools designed for modern educational needs,
            streamlining the assignment process from creation to evaluation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border-t-4 border-t-assignify-primary">
              <CardHeader>
                <div className="feature-icon mb-4 inline-flex">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
