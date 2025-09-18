import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, LogOut, Plus, Edit, Trash2, Eye, Users } from "lucide-react";
import { mockPolicies } from "@/data/mockData";
import PolicyViewer from "@/components/PolicyViewer";
import PolicyEditor from "@/components/PolicyEditor";
import UserManagement from "@/components/UserManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [policies, setPolicies] = useState(mockPolicies);

  const categories = ["all", ...Array.from(new Set(policies.map(p => p.category)))];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSavePolicy = (policyData: any) => {
    if (isCreating) {
      const newPolicy = {
        ...policyData,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString(),
        createdBy: profile?.display_name || 'Admin'
      };
      setPolicies([...policies, newPolicy]);
    } else {
      setPolicies(policies.map(p => 
        p.id === editingPolicy.id 
          ? { ...policyData, lastUpdated: new Date().toISOString() }
          : p
      ));
    }
    setEditingPolicy(null);
    setIsCreating(false);
  };

  const handleDeletePolicy = (policyId: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter(p => p.id !== policyId));
    }
  };

  if (selectedPolicy) {
    return (
      <PolicyViewer 
        policy={selectedPolicy} 
        onBack={() => setSelectedPolicy(null)}
        userRole="admin"
      />
    );
  }

  if (editingPolicy || isCreating) {
    return (
      <PolicyEditor
        policy={editingPolicy}
        onSave={handleSavePolicy}
        onCancel={() => {
          setEditingPolicy(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold">Batth Medicals Ltd - Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile?.display_name || 'Admin'}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="policies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="policies">Policy Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policies" className="space-y-6">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Policy Management</h2>
                <p className="text-muted-foreground">
                  Create, edit, and manage medical policies
                </p>
              </div>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{policies.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <Badge className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {policies.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
            </CardContent>
          </Card>
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
                    <span>{new Date(policy.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setSelectedPolicy(policy)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      onClick={() => setEditingPolicy(policy)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDeletePolicy(policy.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No policies found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;