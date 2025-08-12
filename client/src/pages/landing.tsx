import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Target, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600">FocusFlow</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Combine powerful task management with the proven Pomodoro Technique. 
            Organize your work with our intuitive Kanban board and stay focused with integrated timers.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Now
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Kanban Board</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Organize tasks across customizable stages with drag-and-drop functionality
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Pomodoro Timer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Built-in 25-minute focus sessions with customizable break intervals
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Task Priorities</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Set high, medium, or low priorities to focus on what matters most
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg text-gray-900 dark:text-white">Personal Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Your tasks and progress, securely stored and accessible anywhere
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How FocusFlow Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Add your tasks and set priorities. Organize them across To-Do, In Progress, Clarification, and Complete stages.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600 dark:text-green-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Focus Sessions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start a Pomodoro timer for focused 25-minute work sessions. Take breaks when the timer completes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Move tasks through stages as you work. Archive completed tasks to keep your board organized.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of users who have improved their focus and task management with FocusFlow.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In to Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}