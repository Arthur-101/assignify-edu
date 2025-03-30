
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-destructive">Unauthorized</h1>
        
        <p className="text-muted-foreground">
          {user ? (
            <>
              Your role <span className="font-semibold">({user.role})</span> doesn't have permission to access this page.
            </>
          ) : (
            "You don't have permission to access this page."
          )}
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
