import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GapItem } from "@/types";

interface GapsReportProps {
  open: boolean;
  onClose: () => void;
  gaps: GapItem[];
  onTeachConcept: (concept: string) => void;
}

const GapsReport = ({ open, onClose, gaps, onTeachConcept }: GapsReportProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Gaps Report</DialogTitle>
          <DialogDescription className="text-neutral-600">
            Based on your uploaded material, these concepts haven't been fully covered yet:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {gaps.map((gap, index) => (
            <div key={index} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{gap.concept}</h3>
                <span 
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    gap.status === "not_covered" 
                      ? "bg-secondary/20 text-secondary-dark" 
                      : gap.status === "partially_covered" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-accent/20 text-accent-dark"
                  }`}
                >
                  {gap.status === "not_covered" 
                    ? "Not Covered" 
                    : gap.status === "partially_covered" 
                    ? "Partially Covered" 
                    : "Covered"
                  }
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-1">{gap.description}</p>
              {(gap.status === "not_covered" || gap.status === "partially_covered") && (
                <button 
                  className="mt-2 text-xs text-primary font-medium hover:underline"
                  onClick={() => onTeachConcept(gap.concept)}
                >
                  {gap.status === "not_covered" ? "Teach this next" : "Expand on this"}
                </button>
              )}
            </div>
          ))}

          {gaps.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-neutral-500">No gaps found in your teaching! Great job!</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GapsReport;
