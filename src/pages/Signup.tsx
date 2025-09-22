import React from 'react';
import LoginPage from './Login';

// Wrapper page that forces initial user mode 'signup'
const SignupPage: React.FC = () => {
  return <LoginPage />; // LoginPage internally lets user switch; simple reuse
};
export default SignupPage;
