import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Simple authentication hook simulation
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
    const mockUsers: Record<string, { password: string; user: User }> = {
      "admin@complanthub.com": {
        password: "admin123",
        user: {
          id: "1",
          email: "admin@complanthub.com",
          name: "Admin User",
          role: "admin"
        }
      },
      "user@example.com": {
        password: "user123",
        user: {
          id: "2",
          email: "user@example.com",
          name: "John Doe",
          role: "user"
        }
      }
    };

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem("auth_user", JSON.stringify(mockUser.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin"
  };
};

// Login component
interface LoginFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const LoginForm = ({ onSuccess, onCancel }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-foreground">Login</h3>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground text-2xl"
            >
              ×
            </button>
          )}
        </div>

        <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <p><strong>Admin:</strong> admin@complanthub.com / admin123</p>
          <p><strong>User:</strong> user@example.com / user123</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};