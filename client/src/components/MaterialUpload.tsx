import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MaterialUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const MaterialUpload = ({ open, onClose, onUpload }: MaterialUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);
      setFiles([...files, ...fileArray]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files) {
      const fileArray = Array.from(event.dataTransfer.files);
      setFiles([...files, ...fileArray]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = () => {
    onUpload(files);
    setFiles([]);
    onClose();
  };

  const handleCancel = () => {
    setFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Material</DialogTitle>
          <DialogDescription className="text-neutral-600">
            Upload materials to help the AI understand what you want to teach.
          </DialogDescription>
        </DialogHeader>
        
        <div
          className={`border-2 border-dashed ${
            isDragging ? "border-primary" : "border-neutral-300"
          } rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <i className="fas fa-file-upload text-3xl text-neutral-400 mb-2"></i>
          <p className="mb-1 font-medium">Drag files here or click to browse</p>
          <p className="text-xs text-neutral-500">Supports PDF, PPT, DOCX, TXT (Max 10MB)</p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        
        {files.length > 0 && (
          <div className="mt-4">
            {files.map((file, index) => (
              <div key={index} className="py-2 px-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <i className={`fas fa-file-${getFileIcon(file.name)} text-${getFileColor(file.name)} mr-2`}></i>
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <button
                  className="text-neutral-400 hover:text-neutral-700"
                  onClick={() => handleRemoveFile(index)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter className="flex justify-end mt-6 space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary-dark" onClick={handleUpload} disabled={files.length === 0}>
            Upload & Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function getFileIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'ppt':
    case 'pptx':
      return 'powerpoint';
    case 'doc':
    case 'docx':
      return 'word';
    case 'txt':
      return 'alt';
    default:
      return 'alt';
  }
}

function getFileColor(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'red-500';
    case 'ppt':
    case 'pptx':
      return 'orange-500';
    case 'doc':
    case 'docx':
      return 'blue-500';
    case 'txt':
      return 'neutral-500';
    default:
      return 'neutral-500';
  }
}

export default MaterialUpload;
