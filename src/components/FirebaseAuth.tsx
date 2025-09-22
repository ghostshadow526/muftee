import { useState } from "react";
import { useAuth, getAuthErrorMessage } from "../hooks/useFirebaseAuth";
import { AuthError } from "firebase/auth";

interface AuthFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialMode?: "login" | "signup";
}

export const AuthForm = ({ onSuccess, onCancel, initialMode = "login" }: AuthFormProps) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      onSuccess?.();
    } catch (err) {
      setError(getAuthErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    setError("");
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-foreground">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Enter your password"
              required
              minLength={6}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col space-y-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? 
                (mode === "login" ? "Signing in..." : "Creating account...") : 
                (mode === "login" ? "Sign In" : "Create Account")
              }
            </button>

            <button
              type="button"
              onClick={switchMode}
              className="text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {mode === "login" ? 
                "Don't have an account? Sign up" : 
                "Already have an account? Sign in"
              }
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue as guest
              </button>
            )}
          </div>
        </form>

        {mode === "login" && (
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Demo Account:</p>
            <p><strong>Admin:</strong> admin@complanthub.com / admin123</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your own account to submit and track complaints
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
          <a href="/" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>; 
};