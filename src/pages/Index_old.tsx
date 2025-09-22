import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/FirebaseAuth";
import { useAuth } from "../hooks/useFirebaseAuth";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (currentUser) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [currentUser, isAdmin, navigate]);

  const handleAuthSuccess = () => {
    setShowAuth(false);
    // Navigation will be handled by the useEffect above
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="header-professional sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">ComplaintHub</h1>
              <span className="ml-2 text-sm text-muted-foreground">Professional Complaint Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Dashboard
              </a>
              <button
                onClick={() => setShowSubmitForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Submit New Complaint
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Professional Complaint Management System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Submit, track, and resolve complaints efficiently with real-time updates and secure handling.
            Your voice matters, and we're here to help.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-professional p-6 text-center">
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <div className="text-muted-foreground">Total Complaints</div>
          </div>
          <div className="card-professional p-6 text-center">
            <div className="text-3xl font-bold text-warning">{stats.inProgress}</div>
            <div className="text-muted-foreground">In Progress</div>
          </div>
          <div className="card-professional p-6 text-center">
            <div className="text-3xl font-bold text-success">{stats.resolved}</div>
            <div className="text-muted-foreground">Resolved</div>
          </div>
          <div className="card-professional p-6 text-center">
            <div className="text-3xl font-bold text-muted-foreground">{stats.closed}</div>
            <div className="text-muted-foreground">Closed</div>
          </div>
        </section>

        {/* Filter and Search Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("submitted")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "submitted" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Submitted ({stats.submitted})
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "in-progress" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setFilter("resolved")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "resolved" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Resolved ({stats.resolved})
              </button>
            </div>
            
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 p-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              />
            </div>
          </div>
        </section>

        {/* Complaints List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">
              {filter === "all" ? "All Complaints" : 
               filter === "submitted" ? "Submitted Complaints" :
               filter === "in-progress" ? "In Progress Complaints" :
               "Resolved Complaints"} 
              ({filteredComplaints.length})
            </h3>
          </div>
          
          {filteredComplaints.length === 0 ? (
            <div className="card-professional p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "No complaints found matching your search." : "No complaints found."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Submit First Complaint
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onStatusChange={updateComplaintStatus}
                  onPriorityChange={updateComplaintPriority}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Submit Complaint Modal */}
      {showSubmitForm && (
        <ComplaintForm
          onSubmit={handleSubmitComplaint}
          onCancel={() => setShowSubmitForm(false)}
        />
      )}
    </div>
  );
};

export default Index;