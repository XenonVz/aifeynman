import { useState, useEffect } from "react";
import { GapItem, ChatMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface UseMaterialsProps {
  activeSessionId?: number | null;
  userId?: number | null;
  messages?: ChatMessage[];
}

export function useMaterials({ activeSessionId, userId, messages = [] }: UseMaterialsProps = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [materials, setMaterials] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showGapsReport, setShowGapsReport] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  
  // Query to get gaps from the database
  const { 
    data: gaps = [], 
    isLoading: isLoadingGaps,
    refetch: refetchGaps
  } = useQuery({
    queryKey: ['/api/gaps', activeSessionId],
    enabled: !!activeSessionId,
    queryFn: async () => {
      if (!activeSessionId) return [];
      
      try {
        // In a real implementation, we would call the API
        // const response = await apiRequest('GET', `/api/sessions/${activeSessionId}/gaps`);
        // return await response.json();
        
        // For now, generate gaps based on message content
        if (messages.length > 0) {
          const userMessages = messages
            .filter(msg => msg.role === "user")
            .map(msg => msg.content)
            .join(" ")
            .toLowerCase();
          
          return generateGapsFromContent(userMessages);
        }
        
        return [];
      } catch (error) {
        console.error('Failed to fetch gaps:', error);
        return [];
      }
    }
  });
  
  // Mutation to save a material to the database
  const saveMaterial = useMutation({
    mutationFn: async (materialData: { 
      userId: number; 
      sessionId: number; 
      name: string;
      type: "text" | "pdf" | "docx" | "ppt";
      content: string;
    }) => {
      if (!materialData.userId) throw new Error("No user ID provided");
      
      // In a real implementation, we would call the API
      // const response = await apiRequest('POST', '/api/materials', materialData);
      // return await response.json();
      
      // For now, just return a mock success response
      return {
        id: Date.now(),
        ...materialData,
        createdAt: new Date(),
        extractedConcepts: []
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/materials', activeSessionId] });
      
      // After uploading material, analyze for gaps
      analyzeGaps();
    },
    onError: (error) => {
      console.error('Failed to save material:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save the material",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to save a gap to the database
  const saveGap = useMutation({
    mutationFn: async (gapData: { 
      sessionId: number; 
      concept: string;
      description: string;
      status: "not_covered" | "partially_covered" | "covered";
    }) => {
      if (!gapData.sessionId) throw new Error("No session ID provided");
      
      // In a real implementation, we would call the API
      // const response = await apiRequest('POST', '/api/gaps', gapData);
      // return await response.json();
      
      // For now, just return a mock success response
      return {
        id: Date.now(),
        ...gapData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/gaps', activeSessionId] });
    },
    onError: (error) => {
      console.error('Failed to save gap:', error);
    }
  });

  const uploadMaterial = async (files: File[]) => {
    if (!userId || !activeSessionId) {
      toast({
        title: "Session Required",
        description: "You need to be in an active session to upload materials.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsUploading(true);
    
    try {
      // Process each file
      for (const file of files) {
        // Read file content
        const content = await readFileAsText(file);
        
        // Determine file type
        let fileType: "text" | "pdf" | "docx" | "ppt" = "text";
        if (file.name.endsWith(".pdf")) fileType = "pdf";
        else if (file.name.endsWith(".docx")) fileType = "docx";
        else if (file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) fileType = "ppt";
        
        // Save to database
        await saveMaterial.mutateAsync({
          userId,
          sessionId: activeSessionId,
          name: file.name,
          type: fileType,
          content: content
        });
      }
      
      setMaterials([...materials, ...files]);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${files.length} file(s).`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload materials. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeGaps = async () => {
    if (!activeSessionId) {
      toast({
        title: "Session Required",
        description: "You need to be in an active session to analyze teaching gaps.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // In a real implementation, we would call the API to analyze gaps
      // const response = await apiRequest("POST", `/api/sessions/${activeSessionId}/analyze_gaps`);
      // const data = await response.json();
      
      // For now, just refetch the gaps
      await refetchGaps();
      
      // Show the gaps report
      setShowGapsReport(true);
      
      toast({
        title: "Analysis Complete",
        description: "Identified knowledge gaps based on your materials and teaching.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze teaching gaps. Please try again.",
        variant: "destructive",
      });
    }
  };

  const teachConcept = (concept: string) => {
    // Update the gap status if it exists
    const matchingGap = gaps.find(gap => gap.concept === concept);
    
    if (matchingGap && activeSessionId) {
      saveGap.mutate({
        sessionId: activeSessionId,
        concept: matchingGap.concept,
        description: matchingGap.description || "",
        status: "covered"
      });
    }
    
    toast({
      title: "Concept Selected",
      description: `Let's teach about: ${concept}`,
    });
    
    setShowGapsReport(false);
  };

  return {
    materials,
    uploadMaterial,
    isUploading,
    gaps,
    analyzeGaps,
    showGapsReport,
    setShowGapsReport,
    showMaterialUpload,
    setShowMaterialUpload,
    teachConcept,
    isLoadingGaps
  };
}

// Helper function to read file content as text
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Helper function to generate gaps from teaching content
// This simulates what would normally be done by the OpenAI API
function generateGapsFromContent(content: string): GapItem[] {
  const gaps: GapItem[] = [];
  
  // Check for physics concepts
  if (content.includes("physics") || content.includes("motion") || content.includes("force")) {
    if (!content.includes("newton") && !content.includes("law of motion")) {
      gaps.push({
        concept: "Newton's Laws of Motion",
        description: "The three fundamental laws that form the foundation of classical mechanics",
        status: "not_covered"
      });
    } else if (!content.includes("second law") || !content.includes("f=ma")) {
      gaps.push({
        concept: "Newton's Second Law",
        description: "The relationship between force, mass and acceleration: F = ma",
        status: "partially_covered"
      });
    }
  }
  
  // Check for math concepts
  if (content.includes("math") || content.includes("equation") || content.includes("formula")) {
    if (!content.includes("algebra") && !content.includes("equation")) {
      gaps.push({
        concept: "Algebraic Equations",
        description: "Mathematical expressions that contain variables and operations",
        status: "not_covered"
      });
    }
    
    if (content.includes("triangle") && !content.includes("pythagorean")) {
      gaps.push({
        concept: "Pythagorean Theorem",
        description: "The relationship between the sides of a right triangle: a² + b² = c²",
        status: "partially_covered"
      });
    }
  }
  
  // Check for programming concepts
  if (content.includes("program") || content.includes("code") || content.includes("software")) {
    if (!content.includes("algorithm") && !content.includes("complexity")) {
      gaps.push({
        concept: "Algorithm Complexity",
        description: "The efficiency of algorithms in terms of time and space requirements",
        status: "not_covered"
      });
    }
    
    if (!content.includes("object") && !content.includes("class") && content.includes("inheritance")) {
      gaps.push({
        concept: "Object-Oriented Programming",
        description: "A programming paradigm based on objects containing data and methods",
        status: "partially_covered"
      });
    }
  }
  
  // If no specific gaps detected, add a general one
  if (gaps.length === 0) {
    gaps.push({
      concept: "Core Principles",
      description: "The foundational principles of the topic you're teaching",
      status: "partially_covered"
    });
  }
  
  return gaps;
}
