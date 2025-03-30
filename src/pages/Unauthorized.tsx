
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-muted/50 to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">Unauthorized Access</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            {user ? (
              <>
                Your role <span className="font-semibold text-foreground">({user.role})</span> doesn't have permission to access this page.
              </>
            ) : (
              "You don't have permission to access this page."
            )}
          </p>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate(-1)} variant="default">Go Back</Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
