import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts & Libs
import { AppStateProvider, useAppState } from "./hooks/use-app-state";
import "./lib/fetch-patch";

// Pages & Components
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import HealthCheck from "./pages/HealthCheck";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import TipsLibrary from "./pages/TipsLibrary";
import Profile from "./pages/Profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Auth Guard Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { token } = useAppState();
  const [, setLocation] = useLocation();

  if (!token) {
    // Ideally use effect, but simple redirect works for client-side
    Promise.resolve().then(() => setLocation('/login'));
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        {/* Protected Routes */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/health-check">
          {() => <ProtectedRoute component={HealthCheck} />}
        </Route>
        <Route path="/reports">
          {() => <ProtectedRoute component={Reports} />}
        </Route>
        <Route path="/reports/:id">
          {() => <ProtectedRoute component={ReportDetail} />}
        </Route>
        <Route path="/tips">
          {() => <ProtectedRoute component={TipsLibrary} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}

export default App;
