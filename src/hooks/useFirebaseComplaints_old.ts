// Legacy corrupted file retained temporarily to avoid import crashes.
// It is no longer used. Export a harmless stub so the build passes.
export const useFirebaseComplaints = () => {
  return {
    complaints: [],
    loading: false,
    error: null,
    addComplaint: async () => { throw new Error("Deprecated hook: useFirebaseComplaints_old"); },
    updateComplaintStatus: async () => { throw new Error("Deprecated hook"); },
    updateComplaintPriority: async () => { throw new Error("Deprecated hook"); },
    assignComplaint: async () => { throw new Error("Deprecated hook"); },
    deleteComplaint: async () => { throw new Error("Deprecated hook"); },
    getStats: () => ({ total:0, submitted:0, inProgress:0, resolved:0, closed:0, highPriority:0, mediumPriority:0, lowPriority:0, recentComplaints:0 }),
    filterComplaints: () => []
  };
};