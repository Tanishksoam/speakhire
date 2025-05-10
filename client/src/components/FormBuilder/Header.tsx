import { HelpCircle, LayoutGrid, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";


type HeaderProps = {
  
  title?: string;
  workspaceName?: string;
  userInitials?: string;
};
export default function Header({
  title = 'My new form',
  workspaceName = 'My workspace',
  userInitials = 'KR',
}: HeaderProps) {
  return (
    <header className="border-b bg-white py-3 px-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-2 text-sm">
          <Link 
            to="/" 
            className="flex items-center hover:text-gray-900 transition-colors"
          >
            <LayoutGrid className="h-5 w-5 mr-2" aria-hidden="true" />
            <span className="font-medium">{workspaceName}</span>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="text-gray-600">{title}</span>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            type="button"
            className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
            aria-label="Help"
          >
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
          </button>
          <Avatar className="h-8 w-8 bg-rose-100">
            <AvatarFallback 
              className="text-rose-500"
              aria-label={`User profile: ${userInitials}`}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}