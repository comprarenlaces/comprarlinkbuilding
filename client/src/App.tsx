import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import ClusterPage from "./pages/ClusterPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Página de listado por clúster */}
      <Route path={"/cluster/:cluster"} component={ClusterPage} />
      {/* Rutas dinámicas por clúster/slug — estructura real de comprarlinkbuilding.com */}
      <Route path={"/:cluster/:slug"} component={ArticlePage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
