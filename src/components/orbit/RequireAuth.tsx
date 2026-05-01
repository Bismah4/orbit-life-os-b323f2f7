import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOrbit } from "@/store/orbit";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthed, hasOnboarded } = useOrbit();
  const location = useLocation();
  if (!hasOnboarded) return <Navigate to="/onboarding" replace state={{ from: location }} />;
  if (!isAuthed) return <Navigate to="/auth" replace state={{ from: location }} />;
  return <>{children}</>;
};
