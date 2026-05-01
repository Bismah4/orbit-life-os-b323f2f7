import { ReactNode } from "react";

// Constrains everything (including overlays) to mobile-app width
export const AppFrame = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen w-full bg-black/40 flex items-stretch justify-center">
    <div className="app-frame relative" id="orbit-app-frame">
      {children}
    </div>
  </div>
);
