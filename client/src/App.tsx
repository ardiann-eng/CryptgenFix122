import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Finance from "./pages/Finance";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

function Router() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPath={location} />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/announcements" component={Announcements} />
            <Route path="/finance" component={Finance} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
