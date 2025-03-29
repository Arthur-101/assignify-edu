
import { ArrowRight, CheckSquare, ClipboardList, LineChart, Upload } from "lucide-react";

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple Yet Powerful Workflow
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our streamlined process ensures efficiency from assignment creation to performance analysis.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute left-16 md:left-24 top-0 bottom-0 w-1 bg-gradient-to-b from-assignify-primary via-assignify-secondary to-assignify-accent hidden md:block"></div>
            
            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-assignify-primary text-white flex items-center justify-center text-xl font-bold shrink-0 z-10">1</div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 flex-1 card-hover border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <ClipboardList className="text-assignify-primary" size={28} />
                    <h3 className="text-xl md:text-2xl font-bold">Teachers Create Assignments</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Teachers upload assignments with detailed instructions, rubrics, and deadlines. 
                    They can select specific batches, set evaluation criteria, and upload reference answers.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-assignify-secondary text-white flex items-center justify-center text-xl font-bold shrink-0 z-10">2</div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 flex-1 card-hover border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <Upload className="text-assignify-secondary" size={28} />
                    <h3 className="text-xl md:text-2xl font-bold">Students Submit Their Work</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Students can view assignment details, deadlines, and submit their work in various formats including PDFs, 
                    documents, and other file types. The system tracks submission time and status.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-assignify-accent text-white flex items-center justify-center text-xl font-bold shrink-0 z-10">3</div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 flex-1 card-hover border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <CheckSquare className="text-assignify-accent" size={28} />
                    <h3 className="text-xl md:text-2xl font-bold">System Evaluates Automatically</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    The system can evaluate submissions using text matching, natural language processing, 
                    or keyword analysis based on predefined rubrics. Teachers also have the option for manual evaluation.
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-assignify-primary to-assignify-accent text-white flex items-center justify-center text-xl font-bold shrink-0 z-10">4</div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 flex-1 card-hover border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <LineChart className="text-assignify-primary" size={28} />
                    <h3 className="text-xl md:text-2xl font-bold">Statistics and Insights Generated</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed analytics and reports are generated for students and teachers. Performance trends, 
                    comparisons, and insights help identify strengths and areas for improvement.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Final Arrow */}
            <div className="flex justify-center mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <ArrowRight size={32} className="text-assignify-primary" />
              </div>
            </div>
            
            {/* Result Box */}
            <div className="mt-12 bg-gradient-to-r from-assignify-primary to-assignify-accent rounded-lg shadow-lg p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Complete Educational Ecosystem</h3>
              <p className="text-lg max-w-2xl mx-auto">
                A streamlined, efficient process that benefits administrators, teachers, and students,
                creating a collaborative environment for educational excellence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
