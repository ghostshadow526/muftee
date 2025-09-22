import { useState, useEffect } from "react";
import { Complaint } from "../components/ComplaintForm";

const STORAGE_KEY = "complaints_data";

// Sample initial data
const initialComplaints: Complaint[] = [
  {
    id: "1",
    title: "Website Loading Issues",
    description: "The website takes too long to load on mobile devices, especially on slower connections. This affects user experience significantly.",
    status: "submitted",
    category: "Technical",
    submittedAt: "2025-09-22",
    priority: "high",
    submittedBy: "John Smith",
    lastUpdated: "2025-09-22"
  },
  {
    id: "2", 
    title: "Customer Service Response Delay",
    description: "Response time for customer service is over 24 hours, which is unacceptable for urgent matters.",
    status: "in-progress",
    category: "Service",
    submittedAt: "2025-09-21",
    priority: "medium",
    submittedBy: "Sarah Johnson",
    assignedTo: "Support Team Lead",
    lastUpdated: "2025-09-22"
  },
  {
    id: "3",
    title: "Billing Discrepancy",
    description: "My last invoice shows charges that don't match my service plan. Need clarification on additional fees.",
    status: "resolved",
    category: "Billing",
    submittedAt: "2025-09-20",
    priority: "high",
    submittedBy: "Mike Davis",
    assignedTo: "Billing Department",
    lastUpdated: "2025-09-21"
  }
];

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Load complaints from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setComplaints(JSON.parse(saved));
      } else {
        setComplaints(initialComplaints);
      }
    } catch (error) {
      console.error("Error loading complaints:", error);
      setComplaints(initialComplaints);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save complaints to localStorage whenever complaints change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
      } catch (error) {
        console.error("Error saving complaints:", error);
      }
    }
  }, [complaints, loading]);

  const addComplaint = (newComplaint: Omit<Complaint, "id" | "status" | "submittedAt">) => {
    const complaint: Complaint = {
      ...newComplaint,
      id: Date.now().toString(),
      status: "submitted",
      submittedAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setComplaints(prev => [complaint, ...prev]);
    return complaint;
  };

  const updateComplaintStatus = (id: string, newStatus: Complaint["status"]) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id 
        ? { ...complaint, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : complaint
    ));
  };

  const updateComplaintPriority = (id: string, newPriority: Complaint["priority"]) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === id 
        ? { ...complaint, priority: newPriority, lastUpdated: new Date().toISOString().split('T')[0] }
        : complaint
    ));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== id));
  };

  const getComplaintById = (id: string) => {
    return complaints.find(complaint => complaint.id === id);
  };

  const getComplaintsByStatus = (status: Complaint["status"]) => {
    return complaints.filter(complaint => complaint.status === status);
  };

  const getComplaintsByCategory = (category: string) => {
    return complaints.filter(complaint => complaint.category === category);
  };

  const getComplaintsByPriority = (priority: Complaint["priority"]) => {
    return complaints.filter(complaint => complaint.priority === priority);
  };

  const searchComplaints = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return complaints.filter(complaint => 
      complaint.title.toLowerCase().includes(lowercaseQuery) ||
      complaint.description.toLowerCase().includes(lowercaseQuery) ||
      complaint.category.toLowerCase().includes(lowercaseQuery) ||
      complaint.submittedBy?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getStats = () => {
    const total = complaints.length;
    const submitted = complaints.filter(c => c.status === "submitted").length;
    const inProgress = complaints.filter(c => c.status === "in-progress").length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const closed = complaints.filter(c => c.status === "closed").length;
    
    const highPriority = complaints.filter(c => c.priority === "high").length;
    const mediumPriority = complaints.filter(c => c.priority === "medium").length;
    const lowPriority = complaints.filter(c => c.priority === "low").length;

    return {
      total,
      submitted,
      inProgress,
      resolved,
      closed,
      highPriority,
      mediumPriority,
      lowPriority
    };
  };

  return {
    complaints,
    loading,
    addComplaint,
    updateComplaintStatus,
    updateComplaintPriority,
    deleteComplaint,
    getComplaintById,
    getComplaintsByStatus,
    getComplaintsByCategory,
    getComplaintsByPriority,
    searchComplaints,
    getStats
  };
};