import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, LogOut, Filter, Eye, Loader2 } from "lucide-react";
import batthLogo from "@/assets/batth-logo.png";
import PolicyViewer from "@/components/PolicyViewer";
import { useAuth } from "@/hooks/useAuth";
import { usePolicies, Policy } from "@/hooks/usePolicies";
import { formatDate } from "@/lib/utils";

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const { policies, loading } = usePolicies();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const categories = ["all", ...Array.from(new Set(policies.map(p => p.category)))];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPolicy) {
    return (
      <PolicyViewer 
        policy={selectedPolicy} 
        onBack={() => setSelectedPolicy(null)}
        userRole="staff"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <img src={batthLogo} alt="Batth Medicals Ltd" className="h-10 w-auto" />
            <h1 className="text-xl font-semibold">Batth Medicals Ltd</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.display_name || 'User'}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Policy Library</h2>
          <p className="text-muted-foreground">
            Access and review medical policies and procedures
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading policies...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                  <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                    {policy.status}
                  </Badge>
                </div>
                <CardDescription>{policy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{policy.category}</Badge>
                  </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Last Updated:</span>
                     <span>{formatDate(policy.updated_at)}</span>
                   </div>
                  <Button 
                    onClick={() => setSelectedPolicy(policy)}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Policy
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}

            {filteredPolicies.length === 0 && !loading && (
              <div className="text-center py-12 col-span-full">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No policies found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;