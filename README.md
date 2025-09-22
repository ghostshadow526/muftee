# ComplaintHub - Professional Complaint Management System

A modern, responsive web application for managing complaints and customer feedback efficiently. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Submit Complaints**: Easy-to-use form for submitting detailed complaints
- **Status Tracking**: Real-time complaint status updates (Submitted → In Progress → Resolved → Closed)
- **Priority Management**: Categorize complaints by priority (Low, Medium, High)
- **Category System**: Organize complaints by type (Technical, Service, Billing, etc.)
- **Search & Filter**: Advanced filtering and search functionality
- **Local Storage**: Persistent data storage in browser

### 👥 User Management
- **Public Interface**: Anyone can submit and view complaints
- **Admin Dashboard**: Management interface for handling complaints
- **Authentication**: Demo login system with admin and user roles
- **Role-based Access**: Different views and permissions based on user role

### 🎨 Design System
- **Professional Theme**: Clean, modern design with blue color scheme
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: CSS variables support theme switching
- **Consistent UI**: Professional card components and consistent spacing
- **Smooth Animations**: Fade-in effects and smooth transitions

### 📊 Analytics & Reporting
- **Statistics Dashboard**: Overview of complaint metrics
- **Priority Alerts**: Highlight high-priority and overdue complaints
- **Resolution Tracking**: Monitor complaint resolution rates
- **Category Breakdown**: Analyze complaints by category

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Hooks + Local Storage
- **Data Fetching**: TanStack Query (React Query)
- **Build Tool**: Vite
- **UI Components**: Custom shadcn/ui-inspired components

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd muftee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### For General Users
1. **Submit a Complaint**
   - Click "Submit New Complaint" button
   - Fill in the required information
   - Select appropriate category and priority
   - Submit and receive a unique complaint ID

2. **Track Complaints**
   - View all submitted complaints on the main page
   - Filter by status or search by keywords
   - See real-time status updates

### For Administrators
1. **Access Admin Dashboard**
   - Navigate to `/admin`
   - Login with demo credentials:
     - Email: `admin@complanthub.com`
     - Password: `admin123`

2. **Manage Complaints**
   - View comprehensive complaint statistics
   - Update complaint status and priority
   - Monitor high-priority and overdue items
   - Filter and search through all complaints

## Demo Accounts

- **Admin User**
  - Email: `admin@complanthub.com`
  - Password: `admin123`
  - Access: Full admin dashboard with management capabilities

- **Regular User**
  - Email: `user@example.com`
  - Password: `user123`
  - Access: Standard user interface

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Core UI components (Button, Card, etc.)
│   ├── Auth.tsx        # Authentication components
│   ├── ComplaintCard.tsx    # Individual complaint display
│   └── ComplaintForm.tsx    # Complaint submission form
├── hooks/              # Custom React hooks
│   └── useComplaints.ts     # Complaint data management
├── pages/              # Page components
│   ├── Index.tsx       # Main public page
│   ├── AdminDashboard.tsx   # Admin management interface
│   └── NotFound.tsx    # 404 error page
├── lib/                # Utility functions
│   └── utils.ts        # Helper functions
├── app.tsx             # Main App component with routing
├── main.tsx           # React app entry point
└── index.css          # Global styles and design system
```

## Key Features Explained

### Design System
The application uses a comprehensive CSS design system with:
- CSS custom properties for consistent theming
- Professional color palette optimized for complaint management
- Responsive breakpoints and spacing scale
- Custom component classes for cards, headers, and status indicators

### State Management
- **Local Storage**: Persistent complaint data across browser sessions
- **React Hooks**: Efficient state management with useState and useEffect
- **Custom Hooks**: Centralized complaint management logic

### Responsive Design
- **Mobile-first**: Optimized for mobile devices with progressive enhancement
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts
- **Touch-friendly**: Appropriate touch targets and spacing for mobile

### Status Workflow
Complaints follow a clear progression:
1. **Submitted**: Initial state when complaint is created
2. **In Progress**: Being actively worked on by support team
3. **Resolved**: Issue has been addressed and solution provided
4. **Closed**: Complaint is finalized and archived

## Customization

### Adding New Categories
Edit the categories array in `ComplaintForm.tsx`:
```typescript
const categories = [
  "Technical",
  "Service", 
  "Billing",
  "Product",
  "Account",
  "Privacy",
  "Your New Category"
];
```

### Modifying Status Colors
Update status colors in `index.css`:
```css
--status-submitted: 217 91% 60%;
--status-in-progress: 38 92% 50%;
--status-resolved: 142 76% 36%;
--status-closed: 215 16% 57%;
```

### Adding Authentication Providers
Extend the `useAuth` hook in `Auth.tsx` to integrate with real authentication services.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@complanthub.com or create an issue in the repository.

---

**ComplaintHub** - Transforming complaint management with modern web technology. 🚀