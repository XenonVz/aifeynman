import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User, AiPersona } from "@shared/schema";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SidebarProps {
  user: User | null;
  persona: AiPersona | null;
}

const Sidebar = ({ user, persona }: SidebarProps) => {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Partial<AiPersona> | null>(null);
  const [interestInput, setInterestInput] = useState("");
  
  // Initialize edited persona from the current persona when opening the dialog
  const openEditDialog = () => {
    if (persona) {
      setEditedPersona({
        name: persona.name,
        age: persona.age,
        interests: [...persona.interests],
        communicationStyle: persona.communicationStyle
      });
      setIsEditDialogOpen(true);
    }
  };
  
  // Handle adding a new interest
  const handleAddInterest = () => {
    if (!interestInput.trim() || !editedPersona) return;
    
    setEditedPersona({
      ...editedPersona,
      interests: [...(editedPersona.interests || []), interestInput.trim()]
    });
    setInterestInput("");
  };
  
  // Handle removing an interest
  const handleRemoveInterest = (index: number) => {
    if (!editedPersona) return;
    
    const newInterests = [...(editedPersona.interests || [])];
    newInterests.splice(index, 1);
    setEditedPersona({
      ...editedPersona,
      interests: newInterests
    });
  };
  
  // Mutation for updating the AI persona
  const updatePersona = useMutation({
    mutationFn: async (updatedPersona: Partial<AiPersona>) => {
      if (!persona) throw new Error("No persona to update");
      
      // Call the API to update the persona
      const response = await apiRequest('PATCH', `/api/personas/${persona.id}`, updatedPersona);
      return await response.json();
    },
    onSuccess: (updatedPersona) => {
      // Update the persona in the cache
      queryClient.setQueryData(['/api/personas', persona?.id], updatedPersona);
      toast({
        title: "Profile Updated",
        description: `${updatedPersona.name}'s profile has been updated.`
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update persona:", error);
      toast({
        title: "Update Failed",
        description: `Failed to update profile. Please try again.`,
        variant: "destructive"
      });
    }
  });
  
  // Handle saving the edited persona
  const handleSave = () => {
    if (!editedPersona) return;
    
    // Validate the data
    if (!editedPersona.name?.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!editedPersona.age || editedPersona.age < 10 || editedPersona.age > 120) {
      toast({
        title: "Error",
        description: "Age must be between 10 and 120",
        variant: "destructive"
      });
      return;
    }
    
    if (!editedPersona.interests || editedPersona.interests.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one interest",
        variant: "destructive"
      });
      return;
    }
    
    // Update the persona
    updatePersona.mutate(editedPersona);
  };

  return (
    <aside className="hidden md:flex md:flex-col bg-white dark:bg-gray-900 border-r border-neutral-200 dark:border-gray-800 w-72 overflow-y-auto shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold font-accent text-2xl text-primary-dark dark:text-white">Feynman Teacher</h1>
          <ThemeToggle />
        </div>
        <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">Learning through teaching</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-4">
        <div className="px-3 py-2 text-sm font-medium text-neutral-500 dark:text-gray-400">MAIN MENU</div>
        <Link href="/">
          <div className={`flex items-center px-6 py-3 cursor-pointer ${location === "/" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-comment-alt w-5 mr-3 ${location === "/" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Teach AI</span>
          </div>
        </Link>
        <Link href="/sessions">
          <div className={`flex items-center px-6 py-3 cursor-pointer ${location === "/sessions" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-history w-5 mr-3 ${location === "/sessions" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Sessions</span>
          </div>
        </Link>
        <Link href="/materials">
          <div className={`flex items-center px-6 py-3 cursor-pointer ${location === "/materials" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-file-alt w-5 mr-3 ${location === "/materials" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Materials</span>
          </div>
        </Link>
        <Link href="/progress">
          <div className={`flex items-center px-6 py-3 cursor-pointer ${location === "/progress" 
            ? "text-neutral-900 dark:text-white bg-neutral-100 dark:bg-gray-800 border-r-4 border-primary" 
            : "text-neutral-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-800"}`}>
            <i className={`fas fa-chart-bar w-5 mr-3 ${location === "/progress" ? "text-primary" : "text-neutral-500 dark:text-gray-400"}`}></i>
            <span>Progress</span>
          </div>
        </Link>
        
        {/* Current AI Profile */}
        {persona && (
          <>
            <div className="px-3 py-2 mt-6 text-sm font-medium text-neutral-500 dark:text-gray-400">CURRENT AI PROFILE</div>
            <div className="mx-6 p-4 bg-neutral-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center">
                <img
                  src={persona.avatarUrl}
                  alt="AI Avatar"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{persona.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-gray-400">
                    {persona.age} y/o • {persona.interests.slice(0, 2).join(" & ")}
                  </p>
                </div>
              </div>
              <button 
                onClick={openEditDialog}
                className="mt-3 w-full py-1.5 px-3 text-xs bg-white dark:bg-gray-700 border border-neutral-300 dark:border-gray-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-600 text-neutral-700 dark:text-gray-200"
              >
                Edit Profile
              </button>
            </div>
          </>
        )}
      </nav>
      
      {/* User Profile */}
      {user && (
        <div className="border-t border-neutral-200 dark:border-gray-800 p-4 mt-auto">
          <div className="flex items-center">
            <img
              src={user.avatarUrl}
              alt="User Profile"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <p className="font-medium dark:text-white">{user.displayName}</p>
              <p className="text-xs text-neutral-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button className="text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit AI Companion Profile</DialogTitle>
            <DialogDescription>
              Update your AI companion's details to personalize your learning experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ai-name" className="text-right">Name</Label>
              <Input
                id="ai-name"
                value={editedPersona?.name || ""}
                onChange={(e) => setEditedPersona({ ...editedPersona, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ai-age" className="text-right">Age</Label>
              <Input
                id="ai-age"
                type="number"
                min={10}
                max={120}
                value={editedPersona?.age || ""}
                onChange={(e) => setEditedPersona({ ...editedPersona, age: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ai-communication" className="text-right">Style</Label>
              <select
                id="ai-communication"
                value={editedPersona?.communicationStyle || "balanced"}
                onChange={(e) => setEditedPersona({ 
                  ...editedPersona, 
                  communicationStyle: e.target.value as "formal" | "casual" | "balanced"
                })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right mt-2">Interests</Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {editedPersona?.interests?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {interest}
                      <button 
                        className="ml-1 text-xs opacity-70 hover:opacity-100"
                        onClick={() => handleRemoveInterest(index)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new interest"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddInterest}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updatePersona.isPending}
            >
              {updatePersona.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
