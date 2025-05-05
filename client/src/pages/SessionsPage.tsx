import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SessionsPage = () => {
  const mockSessions = [
    {
      id: 1,
      title: "Newton's Laws of Motion",
      date: "Today, 2:30 PM",
      progress: 75,
      steps: ["explain", "review", "simplify"],
      persona: {
        name: "Alex",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex&backgroundColor=ffb300"
      }
    },
    {
      id: 2,
      title: "Photosynthesis Process",
      date: "Yesterday, 4:15 PM",
      progress: 100,
      steps: ["explain", "review", "simplify", "analogize"],
      persona: {
        name: "Jamie",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Jamie&backgroundColor=0096c7"
      }
    },
    {
      id: 3,
      title: "Introduction to Algebra",
      date: "May 10, 2024",
      progress: 50,
      steps: ["explain", "review"],
      persona: {
        name: "Alex",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex&backgroundColor=ffb300"
      }
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Saved Sessions</h1>
          <Button className="bg-primary hover:bg-primary-dark">
            <i className="fas fa-plus mr-2"></i>
            New Session
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold dark:text-white">{session.title}</CardTitle>
                  <img 
                    src={session.persona.avatar} 
                    alt={session.persona.name} 
                    className="w-8 h-8 rounded-full bg-white"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-gray-400">{session.date}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                    <span>Progress</span>
                    <span>{session.progress}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${session.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-4">
                  {["explain", "review", "simplify", "analogize"].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 flex-1 rounded-full ${
                        session.steps.includes(step) ? "bg-accent" : "bg-neutral-200 dark:bg-gray-600"
                      }`}
                    ></div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                    <i className="fas fa-download mr-1"></i> Export
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs text-primary dark:border-gray-600 dark:text-primary-foreground dark:hover:bg-gray-600">
                    <i className="fas fa-play mr-1"></i> Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;
