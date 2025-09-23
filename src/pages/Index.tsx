import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Batth Medicals Ltd</CardTitle>
          <CardDescription className="text-lg">
            Medical Policy Management Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            Our Policies Portal
          </p>
          
          <div className="space-y-4">
            
            <Link to="/auth">
              <Button size="lg" className="w-full">
                Access Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
