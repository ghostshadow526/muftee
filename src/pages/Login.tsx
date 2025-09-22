import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getAuthErrorMessage } from '../hooks/useFirebaseAuth';

// Combined Login / Signup page with dedicated Admin login section.
// Admin cannot sign up. Admin credentials are validated using constants inside useFirebaseAuth.
// Normal users can sign up and are assigned role 'user'.

const LoginPage: React.FC = () => {
  const { login, signup, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [adminMode, setAdminMode] = useState(false); // toggles admin login panel

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      if (isAdmin) navigate('/admin'); else navigate('/dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (adminMode) {
        await login(email, password); // will tag role 'admin' if credentials match
      } else if (mode === 'signup') {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      resetForm();
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_60%),hsl(var(--background))]">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gradient">ComplaintHub</h1>
            <p className="text-muted-foreground mt-2 text-sm tracking-wide">Secure portal for submitting and managing complaints</p>
          </div>

            <div className="flex mb-6 bg-muted/40 rounded-lg p-1">
              <button
                onClick={() => { setAdminMode(false); setMode('login'); resetForm(); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${!adminMode ? 'bg-background shadow border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >User Access</button>
              <button
                onClick={() => { setAdminMode(true); resetForm(); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${adminMode ? 'bg-background shadow border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >Admin Login</button>
            </div>

          {!adminMode && (
            <div className="flex mb-4 bg-muted/30 rounded-md p-1">
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 rounded text-xs font-semibold tracking-wide uppercase ${mode === 'login' ? 'bg-background shadow border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >Login</button>
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-2 rounded text-xs font-semibold tracking-wide uppercase ${mode === 'signup' ? 'bg-background shadow border border-border' : 'text-muted-foreground hover:text-foreground'}`}
              >Sign Up</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 card-professional p-6">
            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">
                {adminMode ? 'Admin Email' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field"
                placeholder={adminMode ? 'Enter admin email' : 'you@example.com'}
              />
            </div>
            {mode === 'signup' && !adminMode && (
              <div>
                <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="field"
                  placeholder="Your Name"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold mb-2 tracking-wide uppercase text-foreground/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : adminMode ? 'Admin Login' : mode === 'signup' ? 'Create Account' : 'Login'}
            </button>

            {adminMode && (
              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                Admin access only. Credentials are verified server-side. User registration is unavailable here.
              </p>
            )}

            {!adminMode && mode === 'login' && (
              <p className="text-[11px] text-muted-foreground text-center">
                Need an account? <button type="button" onClick={() => setMode('signup')} className="text-primary underline-offset-2 hover:underline">Sign up</button>
              </p>
            )}
            {!adminMode && mode === 'signup' && (
              <p className="text-[11px] text-muted-foreground text-center">
                Already have an account? <button type="button" onClick={() => setMode('login')} className="text-primary underline-offset-2 hover:underline">Login</button>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Right Panel / Marketing / Info */}
      <div className="flex-1 hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent">
        <div className="max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Why ComplaintHub?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Real-time complaint tracking</li>
              <li>Priority-based resolution workflow</li>
              <li>Transparent status updates</li>
              <li>Secure role-based access control</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-background/60 border border-border">
              <p className="text-2xl font-bold text-primary">3x</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-1">Faster Response</p>
            </div>
            <div className="p-4 rounded-lg bg-background/60 border border-border">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mt-1">Access Portal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
