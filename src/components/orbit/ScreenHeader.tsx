import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const ScreenHeader = ({ title, action }: { title: string; action?: ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-2">
      <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full glass-card flex items-center justify-center tap">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
      </div>
      {action}
    </div>
  );
};
