import { Complaint } from "./ComplaintForm";

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange?: (id: string, newStatus: Complaint["status"]) => void;
  onPriorityChange?: (id: string, newPriority: Complaint["priority"]) => void;
  detailed?: boolean;
}

export const ComplaintCard = ({ 
  complaint, 
  onStatusChange, 
  onPriorityChange, 
  detailed = false 
}: ComplaintCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "status-submitted";
      case "in-progress": return "status-in-progress";
      case "resolved": return "status-resolved";
      case "closed": return "status-closed";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 font-semibold";
      case "medium": return "text-yellow-600 font-medium";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="card-professional p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-foreground">{complaint.title}</h4>
            <span className="text-xs text-muted-foreground">#{complaint.id}</span>
          </div>
          
          {detailed ? (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {complaint.description}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {complaint.description.length > 120 
                ? `${complaint.description.substring(0, 120)}...` 
                : complaint.description}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-2 ml-4">
          {onStatusChange ? (
            <select
              value={complaint.status}
              onChange={(e) => onStatusChange(complaint.id, e.target.value as Complaint["status"])}
              className={`px-3 py-1 rounded-full text-xs font-medium border-none ${getStatusColor(complaint.status)}`}
            >
              <option value="submitted">Submitted</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
            </span>
          )}
          
          {onPriorityChange ? (
            <select
              value={complaint.priority}
              onChange={(e) => onPriorityChange(complaint.id, e.target.value as Complaint["priority"])}
              className={`text-xs border rounded px-2 py-1 ${getPriorityColor(complaint.priority)}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          ) : (
            <span className={`text-xs ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority.toUpperCase()} Priority
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-3">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="font-medium">Category:</span>
            <span className="ml-1 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
              {complaint.category}
            </span>
          </span>
          {complaint.submittedBy && (
            <span>By: <span className="font-medium">{complaint.submittedBy}</span></span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <span title={`Submitted on ${formatDate(complaint.submittedAt)}`}>
            {getDaysAgo(complaint.submittedAt) === 1 ? 'Yesterday' : 
             getDaysAgo(complaint.submittedAt) === 0 ? 'Today' :
             `${getDaysAgo(complaint.submittedAt)} days ago`}
          </span>
          {complaint.lastUpdated && complaint.lastUpdated !== complaint.submittedAt && (
            <span className="text-xs">
              Updated: {formatDate(complaint.lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {detailed && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {complaint.assignedTo && (
              <div>
                <span className="font-medium text-foreground">Assigned to:</span>
                <span className="ml-2 text-muted-foreground">{complaint.assignedTo}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-foreground">Submitted:</span>
              <span className="ml-2 text-muted-foreground">{formatDate(complaint.submittedAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};