import React from 'react';
import LoginPage from './Login';

// Wrapper page reusing combined login component; admin can toggle admin tab.
const AdminLoginPage: React.FC = () => {
  return <LoginPage />;
};
export default AdminLoginPage;
