import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import PurnaLogo from "./PurnaLogo";

const PurnaHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <PurnaLogo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          
          
          {/* <Link to="/stores" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Find Stores</Link> */}
          {isLanding ? (
            <Link to="/plan">
              <Button size="sm" className="rounded-xl">Start a Plan</Button>
            </Link>
          ) : (
            <Link to="/plan">
              <Button size="sm" variant="outline" className="rounded-xl">New Plan</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card p-4 md:hidden animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/stores" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>Find Stores</Link>
            <Link to="/plan" onClick={() => setMobileOpen(false)}>
              <Button className="w-full rounded-xl">Start a Plan</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default PurnaHeader;
