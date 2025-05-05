import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialUpload from "@/components/MaterialUpload";

const MaterialsPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  
  const mockMaterials = [
    {
      id: 1,
      name: "Physics Handbook Chapter 3.pdf",
      type: "pdf",
      size: "2.4MB",
      date: "Today, 2:30 PM",
      concepts: 12
    },
    {
      id: 2,
      name: "Algebra Fundamentals.pptx",
      type: "ppt",
      size: "1.8MB",
      date: "Yesterday, 4:15 PM",
      concepts: 8
    },
    {
      id: 3,
      name: "Biology Notes.docx",
      type: "docx",
      size: "512KB",
      date: "May 10, 2024",
      concepts: 15
    },
    {
      id: 4,
      name: "Chemistry Formulas.txt",
      type: "txt",
      size: "64KB",
      date: "May 5, 2024",
      concepts: 20
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teaching Materials</h1>
          <Button 
            className="bg-primary hover:bg-primary-dark"
            onClick={() => setShowUpload(true)}
          >
            <i className="fas fa-file-upload mr-2"></i>
            Upload Material
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="presentations">Presentations</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMaterials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-lg bg-${getFileColorClass(material.type)}/10`}>
                        <i className={`fas fa-file-${getFileIcon(material.type)} text-xl text-${getFileColorClass(material.type)}`}></i>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium">{material.name}</CardTitle>
                        <p className="text-xs text-neutral-500">
                          {material.size} • {material.date}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm">Extracted Concepts</span>
                      <span className="text-sm font-medium">{material.concepts}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" className="text-xs">
                        <i className="fas fa-eye mr-1"></i> View
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs text-primary">
                        <i className="fas fa-brain mr-1"></i> Teach This
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMaterials
                .filter(m => m.type === "pdf" || m.type === "docx")
                .map((material) => (
                  // Same card component as above
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-${getFileColorClass(material.type)}/10`}>
                          <i className={`fas fa-file-${getFileIcon(material.type)} text-xl text-${getFileColorClass(material.type)}`}></i>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium">{material.name}</CardTitle>
                          <p className="text-xs text-neutral-500">
                            {material.size} • {material.date}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm">Extracted Concepts</span>
                        <span className="text-sm font-medium">{material.concepts}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs">
                          <i className="fas fa-eye mr-1"></i> View
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs text-primary">
                          <i className="fas fa-brain mr-1"></i> Teach This
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          {/* Similar TabsContent for "presentations" and "notes" */}
          <TabsContent value="presentations" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMaterials
                .filter(m => m.type === "ppt")
                .map((material) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    {/* Same card content */}
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-${getFileColorClass(material.type)}/10`}>
                          <i className={`fas fa-file-${getFileIcon(material.type)} text-xl text-${getFileColorClass(material.type)}`}></i>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium">{material.name}</CardTitle>
                          <p className="text-xs text-neutral-500">
                            {material.size} • {material.date}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm">Extracted Concepts</span>
                        <span className="text-sm font-medium">{material.concepts}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs">
                          <i className="fas fa-eye mr-1"></i> View
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs text-primary">
                          <i className="fas fa-brain mr-1"></i> Teach This
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMaterials
                .filter(m => m.type === "txt")
                .map((material) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    {/* Same card content */}
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg bg-${getFileColorClass(material.type)}/10`}>
                          <i className={`fas fa-file-${getFileIcon(material.type)} text-xl text-${getFileColorClass(material.type)}`}></i>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-medium">{material.name}</CardTitle>
                          <p className="text-xs text-neutral-500">
                            {material.size} • {material.date}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm">Extracted Concepts</span>
                        <span className="text-sm font-medium">{material.concepts}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs">
                          <i className="fas fa-eye mr-1"></i> View
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs text-primary">
                          <i className="fas fa-brain mr-1"></i> Teach This
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <MaterialUpload
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={(files) => {
          console.log("Materials uploaded:", files);
          setShowUpload(false);
        }}
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
