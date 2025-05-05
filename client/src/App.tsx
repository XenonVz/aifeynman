import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import OnboardingPage from "@/pages/OnboardingPage";
import TeachingPage from "@/pages/TeachingPage";
import SessionsPage from "@/pages/SessionsPage";
import MaterialsPage from "@/pages/MaterialsPage";
import ProgressPage from "@/pages/ProgressPage";
import NotFound from "@/pages/not-found";

import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";

import { User, AiPersona } from "@shared/schema";
import { useIsMobile } from "@/hooks/use-mobile";

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    username: "johndoe",
    password: "",
    displayName: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=John",
    createdAt: new Date(),
  });

  const [activePersona, setActivePersona] = useState<AiPersona | null>({
    id: 1,
    userId: 1,
    name: "Alex",
    age: 16,
    interests: ["Science", "Gaming"],
    communicationStyle: "balanced",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
    active: true,
    createdAt: new Date(),
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(!!activePersona);
  const isMobile = useIsMobile();

  const handleOnboardComplete = (persona: AiPersona) => {
    setActivePersona(persona);
    setHasOnboarded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen md:flex-row">
          {isMobile && <MobileHeader user={currentUser} persona={activePersona} />}
          {!isMobile && <Sidebar user={currentUser} persona={activePersona} />}

          <main className="flex-1 flex flex-col overflow-hidden">
            <Switch>
              <Route path="/" component={() => 
                hasOnboarded 
                  ? <TeachingPage persona={activePersona} user={currentUser} /> 
                  : <OnboardingPage onComplete={handleOnboardComplete} />
              } />
              <Route path="/sessions" component={() => <SessionsPage user={currentUser} aiPersonas={[activePersona]} />} />
              <Route path="/materials" component={MaterialsPage} />
              <Route path="/progress" component={ProgressPage} />
              <Route component={NotFound} />
            </Switch>
          </main>

          {isMobile && <MobileNavigation />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
