import { useState } from "react";
import { Button } from "@/components/ui/button";
import MaterialUpload from "@/components/MaterialUpload";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { User, Session, Material } from "@shared/schema";

interface MaterialsPageProps {
  user: User | null;
}

const MaterialsPage = ({ user }: MaterialsPageProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;
  
  // Query for fetching user's materials
  const { data: materials, isLoading } = useQuery({
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
  
  // Mutation for uploading materials
  const uploadMaterials = useMutation({
    mutationFn: async (files: File[]) => {
      // Here, we would normally process the files and upload them
      // For example, using FormData with a fetch request
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      
      // In a real implementation, we would use:
      // const response = await apiRequest('POST', '/api/materials/upload', formData, true);
      // return response.json();
      
      // For now, just simulate success
      return {
        success: true,
        count: files.length
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      toast({
        title: "Materials Uploaded",
        description: "Your teaching materials have been uploaded successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: `Failed to upload materials: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    }
  });

  const handleUpload = (files: File[]) => {
    uploadMaterials.mutate(files);
    setShowUpload(false);
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
          <h1 className="text-2xl font-bold dark:text-white">Teaching Materials</h1>
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={() => setShowUpload(true)}
          >
            <i className="fas fa-file-upload mr-2"></i>
            Upload Material
          </Button>
        </motion.div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-neutral-300 dark:text-gray-600 mb-4"></i>
            <h3 className="text-xl font-medium text-neutral-600 dark:text-gray-300">Loading materials...</h3>
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-4 text-neutral-300 dark:text-gray-600">
              <i className="fas fa-file-upload"></i>
            </div>
            <h3 className="text-xl font-medium text-neutral-600 dark:text-gray-300 mb-2">No materials uploaded yet</h3>
            <p className="text-neutral-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Upload learning materials like PDFs, documents, or presentations to start teaching with the Feynman technique.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setShowUpload(true)}
            >
              <i className="fas fa-file-upload mr-2"></i>
              Upload Material
            </Button>
          </motion.div>
        )}
      </div>
      
      <MaterialUpload
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

function getFileIcon(type: string): string {
  switch (type) {
    case 'pdf':
      return 'pdf';
    case 'ppt':
      return 'powerpoint';
    case 'docx':
      return 'word';
    case 'txt':
      return 'alt';
    default:
      return 'alt';
  }
}

function getFileColorClass(type: string): string {
  switch (type) {
    case 'pdf':
      return 'red-500';
    case 'ppt':
      return 'orange-500';
    case 'docx':
      return 'blue-500';
    case 'txt':
      return 'neutral-500';
    default:
      return 'neutral-500';
  }
}

export default MaterialsPage;
