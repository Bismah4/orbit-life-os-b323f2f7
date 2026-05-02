import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppFrame } from "@/components/orbit/AppFrame";
import { BottomNav } from "@/components/orbit/BottomNav";
import { RequireAuth } from "@/components/orbit/RequireAuth";

import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Capture from "./pages/Capture";
import Feed from "./pages/Feed";
import Memory from "./pages/Memory";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import TaskDetail from "./pages/TaskDetail";
import DailyPulse from "./pages/DailyPulse";
import { Admin, AdminCategory, AdminItemDetail } from "./pages/Admin";
import Premium from "./pages/Premium";
import PersonalInfo from "./pages/profile/PersonalInfo";
import ConnectedAccounts from "./pages/profile/ConnectedAccounts";
import Security from "./pages/profile/Security";
import DailyPulseTime from "./pages/profile/DailyPulseTime";
import ReminderStyle from "./pages/profile/ReminderStyle";
import { Support, Privacy, Terms } from "./pages/profile/InfoScreens";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  if (typeof window !== "undefined") setTimeout(() => window.scrollTo(0, 0), 0);
  return null;
};

const Routed = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/feed" element={<RequireAuth><Feed /></RequireAuth>} />
      <Route path="/capture" element={<RequireAuth><Capture /></RequireAuth>} />
      <Route path="/memory" element={<RequireAuth><Memory /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      <Route path="/task/:id" element={<RequireAuth><TaskDetail /></RequireAuth>} />
      <Route path="/daily-pulse" element={<RequireAuth><DailyPulse /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
      <Route path="/admin/:cat" element={<RequireAuth><AdminCategory /></RequireAuth>} />
      <Route path="/admin/:cat/:id" element={<RequireAuth><AdminItemDetail /></RequireAuth>} />
      <Route path="/premium" element={<RequireAuth><Premium /></RequireAuth>} />

      <Route path="/profile/personal" element={<RequireAuth><PersonalInfo /></RequireAuth>} />
      <Route path="/profile/accounts" element={<RequireAuth><ConnectedAccounts /></RequireAuth>} />
      <Route path="/profile/security" element={<RequireAuth><Security /></RequireAuth>} />
      <Route path="/profile/daily-pulse-time" element={<RequireAuth><DailyPulseTime /></RequireAuth>} />
      <Route path="/profile/reminder-style" element={<RequireAuth><ReminderStyle /></RequireAuth>} />
      <Route path="/profile/support" element={<RequireAuth><Support /></RequireAuth>} />
      <Route path="/profile/privacy" element={<RequireAuth><Privacy /></RequireAuth>} />
      <Route path="/profile/terms" element={<RequireAuth><Terms /></RequireAuth>} />

      <Route path="/index" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <BottomNav />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <AppFrame>
          <Routed />
        </AppFrame>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
