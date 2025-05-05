import { useState } from "react";
import { AvatarOption } from "@/types";

interface AvatarSelectionProps {
  options: AvatarOption[];
  selectedAvatar: string;
  onSelect: (url: string) => void;
}

const AvatarSelection = ({ options, selectedAvatar, onSelect }: AvatarSelectionProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-neutral-700 mb-2">Choose an Avatar</label>
      <div className="flex justify-center gap-3 mb-4">
        {options.map((avatar) => (
          <div 
            key={avatar.id}
            className={`avatar-option cursor-pointer p-1 rounded-full border-2 ${
              selectedAvatar === avatar.url 
                ? "border-primary" 
                : "border-transparent hover:border-primary/50"
            }`}
            onClick={() => onSelect(avatar.url)}
          >
            <img 
              src={avatar.url} 
              alt={avatar.alt} 
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelection;
