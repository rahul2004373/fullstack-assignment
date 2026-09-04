import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full text-center p-8 bg-card border-border">
        <CardContent className="space-y-4 pt-4">
          <div className="text-6xl font-black text-zinc-600">404</div>
          <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-xs text-muted-foreground">
            The page you requested doesn't exist or you might not have authorization to view it.
          </p>
          <div className="pt-2">
            <Link to="/">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 text-xs">
                <Home className="w-3.5 h-3.5" /> Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
