import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Policy } from "@/hooks/usePolicies";

interface PolicyEditorProps {
  policy?: Policy;
  onSave: (policyData: Omit<Policy, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  onCancel: () => void;
}

const PolicyEditor = ({ policy, onSave, onCancel }: PolicyEditorProps) => {
  const [formData, setFormData] = useState({
    title: policy?.title || "",
    description: policy?.description || "",
    category: policy?.category || "General",
    content: policy?.content || "",
    status: policy?.status || "active",
    version: policy?.version || "1.0"
  });

  const categories = [
    "General",
    "Patient Care",
    "Safety Protocols",
    "Emergency Procedures",
    "Medication Management",
    "Infection Control",
    "Documentation",
    "Quality Assurance",
    "Occupational Health",
    "Ultrasound",
    "Blood Tests",
    "Risk Assessment",
    "ECG",
    "IV Drip",
    "Aesthetic Treatments"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...policy,
      ...formData
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl font-semibold">
            {policy ? 'Edit Policy' : 'Create New Policy'}
          </h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Policy Details</CardTitle>
              <CardDescription>
                {policy ? 'Edit the policy information below' : 'Create a new medical policy'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Policy Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter policy title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of the policy"
                  className="h-20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    placeholder="e.g., 1.0, 2.1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Policy Content</Label>
                <div className="border border-input rounded-md overflow-hidden">
                  <ReactQuill
                    value={formData.content}
                    onChange={(value) => handleChange('content', value)}
                    placeholder="Enter the full policy content..."
                    style={{ minHeight: '384px' }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean']
                      ],
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike',
                      'list', 'bullet', 'indent', 'align',
                      'link', 'image', 'color', 'background'
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {policy ? 'Update Policy' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PolicyEditor;