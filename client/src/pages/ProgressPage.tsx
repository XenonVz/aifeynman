import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, AiPersona, Session } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProgressPageProps {
  user: User | null;
}

const ProgressPage = ({ user }: ProgressPageProps) => {
  const userId = user?.id;

  // Query to fetch session data from the API
  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['/api/sessions', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      
      // In a real app, we would fetch from the API
      // For now, return an empty array
      // const response = await apiRequest('GET', `/api/sessions?userId=${userId}`);
      // return await response.json();
      
      return [];
    }
  });

  // Query to fetch materials data from the API
  const { data: materials, isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['/api/materials', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      
      // In a real app, we would fetch from the API
      // For now, return an empty array
      // const response = await apiRequest('GET', `/api/materials?userId=${userId}`);
      // return await response.json();
      
      return [];
    }
  });

  const isLoading = isLoadingSessions || isLoadingMaterials;
  const hasNoData = (!isLoading && (!sessions || sessions.length === 0) && (!materials || materials.length === 0));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold dark:text-white">Learning Progress</h1>
        </motion.div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-neutral-300 dark:text-gray-600 mb-4"></i>
            <h3 className="text-xl font-medium text-neutral-600 dark:text-gray-300">Loading progress data...</h3>
          </div>
        ) : hasNoData ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-4 text-neutral-300 dark:text-gray-600">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3 className="text-xl font-medium text-neutral-600 dark:text-gray-300 mb-2">No progress data yet</h3>
            <p className="text-neutral-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start teaching sessions and upload materials to see your learning progress and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary-dark"
                onClick={() => window.location.href = '/sessions'}
              >
                <i className="fas fa-plus mr-2"></i>
                Start Teaching Session
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/materials'}
              >
                <i className="fas fa-file-upload mr-2"></i>
                Upload Learning Materials
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Feynman Technique Progress</CardTitle>
                <CardDescription className="text-muted-foreground dark:text-gray-400">
                  Your progress will appear here after completing teaching sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-10">
                <div className="text-center">
                  <div className="text-4xl text-neutral-300 dark:text-gray-600 mb-2">
                    <i className="fas fa-brain"></i>
                  </div>
                  <p className="text-neutral-500 dark:text-gray-400 max-w-md mx-auto">
                    Complete more teaching sessions to view your progress through the Feynman Technique steps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Knowledge Gaps Analysis</CardTitle>
                <CardDescription className="text-muted-foreground dark:text-gray-400">
                  Upload materials and complete teaching sessions to identify knowledge gaps
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-10">
                <div className="text-center">
                  <div className="text-4xl text-neutral-300 dark:text-gray-600 mb-2">
                    <i className="fas fa-puzzle-piece"></i>
                  </div>
                  <p className="text-neutral-500 dark:text-gray-400 max-w-md mx-auto">
                    We'll analyze your teaching performances against your uploaded materials to identify concepts that need more attention.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;