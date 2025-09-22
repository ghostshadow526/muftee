import { useState } from "react";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "submitted" | "in-progress" | "resolved" | "closed";
  category: string;
  submittedAt: string;
  priority: "low" | "medium" | "high";
  submittedBy?: string;
  assignedTo?: string;
  lastUpdated?: string;
}

interface ComplaintFormProps {
  onSubmit: (complaint: Omit<Complaint, "id" | "status" | "submittedAt">) => void;
  onCancel: () => void;
}

export const ComplaintForm = ({ onSubmit, onCancel }: ComplaintFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as const,
    submittedBy: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.submittedBy.trim()) newErrors.submittedBy = "Name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        submittedBy: ""
      });
    }
  };

  const categories = [
    "Technical",
    "Service",
    "Billing",
    "Product",
    "Account",
    "Privacy",
    "Other"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-foreground">Submit New Complaint</h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.submittedBy}
              onChange={(e) => setFormData({...formData, submittedBy: e.target.value})}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Enter your full name"
            />
            {errors.submittedBy && <p className="text-red-500 text-sm mt-1">{errors.submittedBy}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Brief description of the issue"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-32 bg-background text-foreground"
              placeholder="Please provide detailed information about your complaint..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as "low" | "medium" | "high"})}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};