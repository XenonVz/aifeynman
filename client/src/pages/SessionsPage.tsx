import { useEffect, useState } from "react";
import { User, AiPersona } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessions } from "@/hooks/use-sessions";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";

interface SessionsPageProps {
  user: User | null;
  aiPersonas: AiPersona[] | null;
}

const SessionsPage = ({ user, aiPersonas }: SessionsPageProps) => {
  const isMobile = useIsMobile();
  const [, navigate] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);
  const [newSessionTopic, setNewSessionTopic] = useState("");
  
  const { 
    sessions, 
    isLoading, 
    createSession, 
    exportSession, 
    continueSession 
  } = useSessions(user?.id || null);

  // Select the first persona by default when aiPersonas loads
  useEffect(() => {
    if (aiPersonas && aiPersonas.length > 0 && !selectedPersonaId) {
      setSelectedPersonaId(aiPersonas[0].id);
    }
  }, [aiPersonas, selectedPersonaId]);

  const handleCreateSession = () => {
    if (!newSessionTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a session title",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPersonaId) {
      toast({
        title: "Error",
        description: "Please select an AI persona",
        variant: "destructive"
      });
      return;
    }

    createSession.mutate({
      title: newSessionTitle,
      aiPersonaId: selectedPersonaId,
      topic: newSessionTopic.trim() || undefined
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewSessionTitle("");
        setNewSessionTopic("");
      }
    });
  };

  const handleExport = (sessionId: number) => {
    exportSession(sessionId);
  };

  const handleContinue = (sessionId: number) => {
    continueSession(sessionId);
    navigate("/teaching");
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold dark:text-white">Saved Sessions</h1>
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            New Session
          </Button>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-1.5 flex-1 rounded-full" />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {sessions && sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    layout
                  >
                    <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold dark:text-white">{session.title}</CardTitle>
                          <motion.img 
                            src={session.persona.avatar} 
                            alt={session.persona.name} 
                            className="w-8 h-8 rounded-full bg-white"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-gray-400">{session.date}</p>
                        {session.topic && (
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-xs rounded-full text-primary-dark dark:text-primary-foreground">
                              {session.topic}
                            </span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                            <span>Progress</span>
                            <span>{session.progress}%</span>
                          </div>
                          <div className="h-2 bg-neutral-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-accent rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${session.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 + 0.3 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-1 mb-4">
                          {["explain", "review", "simplify", "analogize"].map((step) => (
                            <motion.div 
                              key={step} 
                              className={`h-1.5 flex-1 rounded-full ${
                                session.steps.includes(step) ? "bg-accent" : "bg-neutral-200 dark:bg-gray-600"
                              }`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                            />
                          ))}
                        </div>
                        
                        <div className="flex justify-between">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                              onClick={() => handleExport(session.id)}
                            >
                              <i className="fas fa-download mr-1"></i> Export
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs text-primary dark:border-gray-600 dark:text-primary-foreground dark:hover:bg-gray-600"
                              onClick={() => handleContinue(session.id)}
                            >
                              <i className="fas fa-play mr-1"></i> Continue
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-5xl mb-4 text-neutral-300 dark:text-gray-600">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3 className="text-xl font-medium text-neutral-600 dark:text-gray-300 mb-2">No sessions yet</h3>
                <p className="text-neutral-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Start your first teaching session to apply the Feynman technique and improve your understanding.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create First Session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Session Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Start a new teaching session with your AI learning companion.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session-title" className="text-right">
                Title
              </Label>
              <Input
                id="session-title"
                placeholder="e.g. Quantum Physics Basics"
                className="col-span-3"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session-topic" className="text-right">
                Topic (optional)
              </Label>
              <Input
                id="session-topic"
                placeholder="e.g. Physics"
                className="col-span-3"
                value={newSessionTopic}
                onChange={(e) => setNewSessionTopic(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ai-persona" className="text-right">
                AI Companion
              </Label>
              <div className="col-span-3">
                <div className="grid grid-cols-2 gap-2">
                  {aiPersonas?.map((persona) => (
                    <div
                      key={persona.id}
                      className={`p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedPersonaId === persona.id
                          ? "border-primary bg-primary/10 dark:bg-primary/20"
                          : "border-neutral-200 dark:border-gray-700"
                      }`}
                      onClick={() => setSelectedPersonaId(persona.id)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={persona.avatarUrl || ""}
                          alt={persona.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium dark:text-white">{persona.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-gray-400">Age: {persona.age}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSession}
              disabled={createSession.isPending}
            >
              {createSession.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  Create Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionsPage;
