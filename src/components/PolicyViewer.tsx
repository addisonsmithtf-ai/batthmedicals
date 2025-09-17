import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Download, Printer } from "lucide-react";

interface PolicyViewerProps {
  policy: any;
  onBack: () => void;
  userRole: 'staff' | 'admin';
}

const PolicyViewer = ({ policy, onBack, userRole }: PolicyViewerProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement('a');
    const file = new Blob([policy.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${policy.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm print:hidden">
        <div className="flex h-16 items-center justify-between px-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{policy.title}</CardTitle>
                <CardDescription className="text-base">{policy.description}</CardDescription>
              </div>
              <Badge variant={policy.status === 'active' ? 'default' : 'secondary'} className="ml-4">
                {policy.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Category: {policy.category}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Version: {policy.version}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div 
                className="whitespace-pre-wrap text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: policy.content.replace(/\n/g, '<br/>') }}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground print:block">
          <p>
            This document was accessed by {userRole} user on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          {policy.createdBy && (
            <p className="mt-1">
              Created by: {policy.createdBy}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PolicyViewer;