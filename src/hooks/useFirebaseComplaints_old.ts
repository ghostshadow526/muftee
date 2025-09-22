import { useState, useEffect } from "react";
imp    if (isAdmin) {
      // Admin sees all complaints
      complaintsQuery = query(
        collection(db, "complain"),
        orderBy("createdAt", "desc")
      );
    } else {
      // Users see only their own complaints
      complaintsQuery = query(
        collection(db, "complain"),
        where("submittedBy", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
    }ction,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useFirebaseAuth";

// Complaint interface for Firebase
export interface FirebaseComplaint {
  id: string;
  title: string;
  description: string;
  status: "submitted" | "in-progress" | "resolved" | "closed";
  category: string;
  priority: "low" | "medium" | "high";
  submittedBy: string; // User ID
  submittedByName: string; // User display name
  submittedByEmail: string; // User email
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  adminNotes?: string;
}

export const useFirebaseComplaints = () => {
  const [complaints, setComplaints] = useState<FirebaseComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, isAdmin } = useAuth();

  // Real-time listener for complaints
  useEffect(() => {
    if (!currentUser) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    let complaintsQuery;
    
    if (isAdmin) {
      // Admin sees all complaints
      complaintsQuery = query(
        collection(db, "complaints"),
        orderBy("createdAt", "desc")
      );
    } else {
      // Regular users see only their complaints
      complaintsQuery = query(
        collection(db, "complaints"),
        where("submittedBy", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(
      complaintsQuery,
      (snapshot) => {
        const complaintsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseComplaint[];
        
        setComplaints(complaintsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching complaints:", error);
        setError("Failed to load complaints");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, isAdmin]);

  // Add new complaint
  const addComplaint = async (complaintData: {
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
  }) => {
    if (!currentUser) {
      throw new Error("User must be authenticated to submit complaints");
    }

    try {
      const newComplaint = {
        ...complaintData,
        status: "submitted" as const,
        submittedBy: currentUser.uid,
        submittedByName: currentUser.displayName,
        submittedByEmail: currentUser.email || "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, "complaints"), newComplaint);
      return docRef.id;
    } catch (error) {
      console.error("Error adding complaint:", error);
      throw new Error("Failed to submit complaint");
    }
  };

  // Update complaint status (admin only)
  const updateComplaintStatus = async (
    complaintId: string, 
    newStatus: FirebaseComplaint["status"],
    adminNotes?: string
  ) => {
    if (!isAdmin) {
      throw new Error("Only administrators can update complaint status");
    }

    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        status: newStatus,
        updatedAt: Timestamp.now(),
        ...(adminNotes && { adminNotes })
      });
    } catch (error) {
      console.error("Error updating complaint status:", error);
      throw new Error("Failed to update complaint status");
    }
  };

  // Update complaint priority (admin only)
  const updateComplaintPriority = async (
    complaintId: string, 
    newPriority: FirebaseComplaint["priority"]
  ) => {
    if (!isAdmin) {
      throw new Error("Only administrators can update complaint priority");
    }

    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        priority: newPriority,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating complaint priority:", error);
      throw new Error("Failed to update complaint priority");
    }
  };

  // Assign complaint to admin (admin only)
  const assignComplaint = async (complaintId: string, assignedTo: string) => {
    if (!isAdmin) {
      throw new Error("Only administrators can assign complaints");
    }

    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, {
        assignedTo,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error assigning complaint:", error);
      throw new Error("Failed to assign complaint");
    }
  };

  // Delete complaint (admin only)
  const deleteComplaint = async (complaintId: string) => {
    if (!isAdmin) {
      throw new Error("Only administrators can delete complaints");
    }

    try {
      await deleteDoc(doc(db, "complaints", complaintId));
    } catch (error) {
      console.error("Error deleting complaint:", error);
      throw new Error("Failed to delete complaint");
    }
  };

  // Get complaint statistics
  const getStats = () => {
    const total = complaints.length;
    const submitted = complaints.filter(c => c.status === "submitted").length;
    const inProgress = complaints.filter(c => c.status === "in-progress").length;
    const resolved = complaints.filter(c => c.status === "resolved").length;
    const closed = complaints.filter(c => c.status === "closed").length;
    
    const highPriority = complaints.filter(c => c.priority === "high").length;
    const mediumPriority = complaints.filter(c => c.priority === "medium").length;
    const lowPriority = complaints.filter(c => c.priority === "low").length;

    const recentComplaints = complaints.filter(c => {
      const daysDiff = (Date.now() - c.createdAt.toMillis()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    return {
      total,
      submitted,
      inProgress,
      resolved,
      closed,
      highPriority,
      mediumPriority,
      lowPriority,
      recentComplaints
    };
  };

  // Filter complaints by various criteria
  const filterComplaints = (filters: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  }) => {
    return complaints.filter(complaint => {
      const matchesStatus = !filters.status || filters.status === "all" || complaint.status === filters.status;
      const matchesPriority = !filters.priority || filters.priority === "all" || complaint.priority === filters.priority;
      const matchesCategory = !filters.category || filters.category === "all" || complaint.category === filters.category;
      const matchesSearch = !filters.search || 
        complaint.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        complaint.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        complaint.submittedByName.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
    });
  };

  return {
    complaints,
    loading,
    error,
    addComplaint,
    updateComplaintStatus,
    updateComplaintPriority,
    assignComplaint,
    deleteComplaint,
    getStats,
    filterComplaints
  };
};