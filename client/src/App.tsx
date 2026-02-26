import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const ClusterPage = lazy(() => import("./pages/ClusterPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0a0a0a'}} />}>
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Páginas legales */}
      <Route path={"/privacidad"} component={PrivacyPage} />
      <Route path={"/aviso-legal"} component={LegalPage} />
      {/* Página de listado por clúster */}
      <Route path={"/cluster/:cluster"} component={ClusterPage} />
      {/* Rutas dinámicas por clúster/slug — estructura real de comprarlinkbuilding.com */}
      <Route path={"/:cluster/:slug"} component={ArticlePage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
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
