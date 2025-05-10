
import React from "react";
import {Card,CardDescription,CardTitle} from "../ui/card";


type OptionCardProps = {
  
  title: string;
  description: string;
  icon: React.ReactNode;
  method: string;
  onSelect: () => void;
};


export default function OptionCard({ icon, title, description, onSelect }: OptionCardProps) {
  return (
    <Card
      className="flex flex-col items-center p-8 cursor-pointer transition-all hover:shadow-md bg-white"
      onClick={() => onSelect()}
    >
      <div className="mb-6 w-20 h-20 flex items-center justify-center">{icon}</div>
      <CardTitle className="text-lg font-medium text-gray-800 mb-2">{title}</CardTitle>
      <CardDescription className="text-sm text-gray-500 text-center max-w-xs">{description}</CardDescription>
    </Card>
  );
}