import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, MessageSquare, User, Calendar, LogOut } from 'lucide-react';
import { useFirebaseComplaints } from '../hooks/useFirebaseComplaints';
import { useAuth } from '../hooks/useFirebaseAuth';

const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { complaints, updateComplaintStatus, updateComplaintPriority, getStats } = useFirebaseComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'in-progress' | 'resolved'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [showAddNote, setShowAddNote] = useState<string | null>(null);

  // Filter complaints based on search and filters
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = !searchTerm || 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate statistics using the hook's getStats method
  const stats = getStats();

  const handleStatusChange = async (complaintId: string, newStatus: 'submitted' | 'in-progress' | 'resolved') => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (complaintId: string, newPriority: 'low' | 'medium' | 'high') => {
    try {
      await updateComplaintPriority(complaintId, newPriority);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleAddNote = async (complaintId: string) => {
    if (!adminNoteInput.trim()) return;
    
    try {
      await updateComplaintStatus(complaintId, complaints.find(c => c.id === complaintId)?.status || 'submitted', adminNoteInput.trim());
      setAdminNoteInput('');
      setShowAddNote(null);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,hsl(222_89%_56%_/_0.08),transparent_60%),radial-gradient(circle_at_80%_30%,hsl(258_90%_66%_/_0.08),transparent_65%),hsl(220_33%_99%)]">
      {/* Header */}
      <header className="header-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient tracking-tight">Admin Dashboard</h1>
              <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-white/40 backdrop-blur border border-white/60 text-foreground shadow-sm">
                ComplaintHub
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground backdrop-safe px-3 py-1 rounded-full bg-white/50 shadow-sm">
                Welcome, {currentUser?.displayName || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline text-sm !px-3 !py-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-professional p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card-professional p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold text-foreground">{stats.submitted}</p>
              </div>
            </div>
          </div>
          <div className="card-professional p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-foreground">{stats.highPriority}</p>
              </div>
            </div>
          </div>
          <div className="card-professional p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card-professional p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 field"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="field !w-auto"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="field !w-auto"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">
              Complaints ({filteredComplaints.length})
            </h2>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="card-professional p-12 text-center animate-fade-in-up">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No complaints found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="card-professional">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {complaint.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority} priority
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {complaint.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{complaint.submittedByEmail}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{(complaint.createdAt as any)?.toDate ? (complaint.createdAt as any).toDate().toLocaleDateString() : new Date(String(complaint.createdAt)).toLocaleDateString()}</span>
                          </div>
                          <span className="bg-muted px-2 py-1 rounded">
                            {complaint.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-white/50">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value as any)}
                        className="field !w-auto !py-1 !text-xs"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <select
                        value={complaint.priority}
                        onChange={(e) => handlePriorityChange(complaint.id, e.target.value as any)}
                        className="field !w-auto !py-1 !text-xs"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>

                      <button
                        onClick={() => handleStatusChange(complaint.id, 'resolved')}
                        disabled={complaint.status === 'resolved'}
                        className={`btn !px-4 !py-1 text-xs ${
                          complaint.status === 'resolved'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'btn-primary bg-green-600 hover:bg-green-600/90'
                        }`}
                      >
                        {complaint.status === 'resolved' ? (
                          <>
                            <span className="mr-1">✅</span>
                            Resolved
                          </>
                        ) : (
                          'Mark Resolved'
                        )}
                      </button>

                      <button
                        onClick={() => setShowAddNote(showAddNote === complaint.id ? null : complaint.id)}
                        className="btn btn-outline !py-1 !text-xs"
                      >
                        Add Note
                      </button>

                      <button
                        onClick={() => setSelectedComplaint(selectedComplaint === complaint.id ? null : complaint.id)}
                        className="btn btn-ghost !py-1 !text-xs"
                      >
                        {selectedComplaint === complaint.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {/* Add Note Form */}
                    {showAddNote === complaint.id && (
                      <div className="mb-4 p-4 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/40">
                        <textarea
                          value={adminNoteInput}
                          onChange={(e) => setAdminNoteInput(e.target.value)}
                          placeholder="Add admin note..."
                          rows={3}
                          className="field resize-none !bg-white/80"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleAddNote(complaint.id)}
                            disabled={!adminNoteInput.trim()}
                            className="btn btn-primary !py-1 !text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Note
                          </button>
                          <button
                            onClick={() => {
                              setShowAddNote(null);
                              setAdminNoteInput('');
                            }}
                            className="btn btn-ghost !py-1 !text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {selectedComplaint === complaint.id && (
                      <div className="border-t border-white/50 pt-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Email: {complaint.submittedByEmail}</p>
                              <p>Name: {complaint.submittedByName || 'Not provided'}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-foreground mb-2">Additional Details</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>Category: {complaint.category}</p>
                              <p>Created: {new Date(complaint.createdAt.toDate()).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Admin Notes */}
                        {complaint.adminNotes && (
                          <div className="mt-4 animate-rise">
                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><span className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded" />Admin Notes</h4>
                            <div className="p-3 rounded-lg bg-white/70 backdrop-blur border border-white/60 shadow-sm">
                              <p className="text-sm leading-relaxed text-foreground/90">{complaint.adminNotes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;