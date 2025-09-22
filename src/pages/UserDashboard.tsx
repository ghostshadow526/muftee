import { useState } from "react";
import { useAuth } from "../hooks/useFirebaseAuth";
import { useFirebaseComplaints, FirebaseComplaint } from "../hooks/useFirebaseComplaints";
import { AuthForm } from "../components/FirebaseAuth";

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { 
    complaints, 
    loading, 
    error, 
    addComplaint, 
    getStats, 
    filterComplaints 
  } = useFirebaseComplaints();

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stats = getStats();
  const filteredComplaints = filterComplaints({ 
    status: filter === "all" ? undefined : filter,
    search: searchQuery 
  });

  const handleSubmitComplaint = async (complaintData: {
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
  }) => {
    setSubmitting(true);
    try {
      await addComplaint(complaintData);
      setShowComplaintForm(false);
    } catch (err) {
      console.error("Error submitting complaint:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Status colors managed via status-* utility classes from global stylesheet

  // Priority colors now handled via dedicated priority badge CSS classes

  const formatDate = (timestamp: any) => {
    return timestamp?.toDate?.()?.toLocaleDateString() || "Unknown date";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,hsl(222_89%_56%_/_0.08),transparent_60%),radial-gradient(circle_at_85%_35%,hsl(258_90%_66%_/_0.08),transparent_65%),hsl(var(--background))]">
      {/* Header */}
      <header className="header-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient tracking-tight">My Complaints</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-white/40 backdrop-blur border border-white/60 text-foreground shadow-sm">Welcome, {currentUser?.displayName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowComplaintForm(true)}
                className="btn btn-gradient shadow-glow"
              >
                Submit New Complaint
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline !py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[{label:'Total Complaints', value: stats.total, color:'text-primary'},
            {label:'Pending', value: stats.submitted + stats.inProgress, color:'text-warning'},
            {label:'Resolved', value: stats.resolved, color:'text-success'},
            {label:'Closed', value: stats.closed, color:'text-muted-foreground'}].map(stat => (
              <div key={stat.label} className="card-professional p-6 text-center animate-fade-in-up hover-lift">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-muted-foreground text-sm tracking-wide mt-1 uppercase">{stat.label}</div>
              </div>
          ))}
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-3">
              {["all", "submitted", "in-progress", "resolved", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`btn text-xs tracking-wide uppercase !px-4 !py-2 ${
                    filter === status
                      ? 'btn-primary shadow-glow'
                      : 'btn-outline hover-lift'
                  }`}
                >
                  {status === "all" ? "All" : status.replace("-", " ")}
                </button>
              ))}
            </div>
            
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="field sm:w-72"
              />
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Complaints List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">
              Your Complaints ({filteredComplaints.length})
            </h3>
          </div>
          
          {filteredComplaints.length === 0 ? (
            <div className="card-professional p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">
                {complaints.length === 0 
                  ? "You haven't submitted any complaints yet." 
                  : "No complaints match your current filters."
                }
              </p>
              {complaints.length === 0 && (
                <button
                  onClick={() => setShowComplaintForm(true)}
                  className="btn btn-primary shadow-glow"
                >
                  Submit Your First Complaint
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {filteredComplaints.map((complaint, idx) => (
                <div
                  key={complaint.id}
                  className="card-professional p-6 animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex gap-6 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-lg font-semibold tracking-tight text-foreground leading-snug">{complaint.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-muted/60 text-muted-foreground tracking-wider">#{String(complaint.id).slice(0,8)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
                        {complaint.description}
                      </p>
                      {complaint.adminNotes && (
                        <div className="mt-3 text-sm bg-secondary/70 text-secondary-foreground/90 px-3 py-2 rounded-lg border border-border/70">
                          <span className="font-medium text-foreground/90">Admin Notes: </span>
                          <span className="opacity-90">{complaint.adminNotes}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`status-${complaint.status} shadow-sm`}>{complaint.status.replace('-', ' ')}</span>
                      <span className={`priority-badge priority-${complaint.priority}`}>{complaint.priority}</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-[11px] tracking-wide text-muted-foreground uppercase">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground/70">Category</span>
                      <span className="px-2 py-1 rounded-full bg-secondary/60 text-secondary-foreground text-[10px] tracking-wider">
                        {complaint.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-medium normal-case text-[11px]">
                      <span className="opacity-80">Submitted: {formatDate(complaint.createdAt)}</span>
                      {complaint.updatedAt && (
                        <span className="opacity-80">Updated: {formatDate(complaint.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Submit Complaint Modal */}
      {showComplaintForm && (
        <ComplaintFormModal
          onSubmit={handleSubmitComplaint}
          onCancel={() => setShowComplaintForm(false)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

// Complaint Form Modal Component
interface ComplaintFormModalProps {
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
  }) => void;
  onCancel: () => void;
  submitting: boolean;
}

const ComplaintFormModal = ({ onSubmit, onCancel, submitting }: ComplaintFormModalProps) => {
  const [formData, setFormData] = useState<{title:string; description:string; category:string; priority:"low"|"medium"|"high"}>({
    title: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.18),transparent_65%)] backdrop-blur-xl" />
      <div className="relative card-professional w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground leading-tight">Submit New Complaint</h3>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Provide clear details so we can address it faster</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost text-lg -mr-2 -mt-2"
            aria-label="Close form"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">
              Complaint Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="field"
              placeholder="Brief description of the issue"
            />
            {errors.title && <p className="text-destructive text-xs mt-1 font-medium">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">
              Detailed Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="field min-h-[8rem] resize-y"
              placeholder="Please provide detailed information about your complaint..."
            />
            {errors.description && <p className="text-destructive text-xs mt-1 font-medium">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="field"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-destructive text-xs mt-1 font-medium">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => {
                  const val = e.target.value as "low"|"medium"|"high";
                  setFormData({...formData, priority: val});
                }}
                className="field"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          <div className="divider" />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="btn btn-outline disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary disabled:opacity-50 shadow-glow"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;