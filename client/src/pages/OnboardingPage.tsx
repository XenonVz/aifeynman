import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import AvatarSelection from "@/components/AvatarSelection";
import { AvatarOption, InterestOption, PersonaFormData } from "@/types";
import { AiPersona } from "@shared/schema";

interface OnboardingPageProps {
  onComplete: (persona: AiPersona) => void;
}

const OnboardingPage = ({ onComplete }: OnboardingPageProps) => {
  const avatarOptions: AvatarOption[] = [
    { id: "avatar1", url: "https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=256&h=256&fit=crop", alt: "Teen boy with dark hair" },
    { id: "avatar2", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop", alt: "Teen girl with blonde hair" },
    { id: "avatar3", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop", alt: "Teen boy with glasses" },
  ];

  const interestOptions: InterestOption[] = [
    { id: "science", label: "Science" },
    { id: "music", label: "Music" },
    { id: "gaming", label: "Gaming" },
    { id: "sports", label: "Sports" },
    { id: "arts", label: "Arts" },
    { id: "technology", label: "Technology" },
  ];

  const [formData, setFormData] = useState<PersonaFormData>({
    name: "",
    age: 16,
    interests: ["Science", "Gaming"],
    communicationStyle: "balanced",
    avatarUrl: avatarOptions[0].url,
  });

  const [communicationValue, setCommunicationValue] = useState([3]);

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else if (formData.interests.length < 3) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  const handleCommunicationStyleChange = (value: number[]) => {
    setCommunicationValue(value);
    
    let style: "formal" | "casual" | "balanced" = "balanced";
    if (value[0] <= 2) {
      style = "formal";
    } else if (value[0] >= 4) {
      style = "casual";
    }
    
    setFormData({
      ...formData,
      communicationStyle: style,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPersona: AiPersona = {
      id: 1,
      userId: 1,
      name: formData.name,
      age: formData.age,
      interests: formData.interests,
      communicationStyle: formData.communicationStyle,
      avatarUrl: formData.avatarUrl,
      active: true,
      createdAt: new Date(),
    };
    
    onComplete(newPersona);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold font-accent mb-6">Welcome to Feynman Teacher!</h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        Create your AI teenager that you can teach anything to. Customize your teaching companion below.
      </p>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">Create Your AI Teenager</h2>
        
        <form onSubmit={handleSubmit}>
          <AvatarSelection
            options={avatarOptions}
            selectedAvatar={formData.avatarUrl}
            onSelect={(url) => setFormData({ ...formData, avatarUrl: url })}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <Input
              type="text"
              placeholder="e.g., Alex, Jamie, Morgan"
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
            <Select
              value={formData.age.toString()}
              onValueChange={(value) => setFormData({ ...formData, age: parseInt(value) })}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="14">14 years old</SelectItem>
                <SelectItem value="15">15 years old</SelectItem>
                <SelectItem value="16">16 years old</SelectItem>
                <SelectItem value="17">17 years old</SelectItem>
                <SelectItem value="18">18 years old</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Interests (select up to 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  className={`px-3 py-1 text-sm ${
                    formData.interests.includes(interest.label)
                      ? "bg-primary-light/20 text-primary-dark"
                      : "bg-neutral-100 text-neutral-700"
                  } rounded-full hover:bg-primary-light/30 active:bg-primary/40`}
                  onClick={() => handleInterestToggle(interest.label)}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Communication Style
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Slider
                  value={communicationValue}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={handleCommunicationStyleChange}
                  className="w-full accent-primary"
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Formal</span>
                <span>Casual</span>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition duration-200"
            disabled={!formData.name || formData.interests.length === 0}
          >
            Create My Teaching Partner
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
