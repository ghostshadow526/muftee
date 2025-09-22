import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

// Extended user interface with role
export interface AppUser extends User {
  role?: "admin" | "user";
  displayName: string | null;
}

// Admin credentials
const ADMIN_EMAIL = "muft3e@gmail.com";
const ADMIN_PASSWORD = "muftee1123";

interface AuthContextType {
  currentUser: AppUser | null;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Create new user account
  const signup = async (email: string, password: string, name: string) => {
    try {
      if (email === ADMIN_EMAIL) {
        throw new Error("Admin accounts cannot be registered. Please use admin login.");
      }
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      const role = "user";
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      });
    } catch (error: any) {
      if (error?.message?.includes('Failed to fetch') || error?.code === 'auth/network-request-failed') {
        error.message = "Network error: unable to reach Firebase Auth service. Check your internet connection, VPN, firewall, or ad blocker.";
      }
      throw error;
    }
  };

  // Sign in existing user
  const login = async (email: string, password: string) => {
    try {
      const isAdminLogin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const role = isAdminLogin ? "admin" : "user";
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { lastLoginAt: new Date().toISOString(), role }, { merge: true });
    } catch (error: any) {
      if (error?.message?.includes('Failed to fetch') || error?.code === 'auth/network-request-failed') {
        error.message = "Network error: unable to reach Firebase Auth service. Verify connectivity or disable interfering extensions.";
      }
      throw error;
    }
  };

  // Sign out user
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Enhanced user object with role information
  const enhanceUser = async (user: User): Promise<AppUser> => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      
      return {
        ...user,
        role: userData?.role || "user",
        displayName: userData?.displayName || user.displayName || user.email || "User"
      } as AppUser;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {
        ...user,
        role: "user",
        displayName: user.displayName || user.email || "User"
      } as AppUser;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const enhancedUser = await enhanceUser(user);
        setCurrentUser(enhancedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = currentUser?.role === "admin";

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Helper function to get Firebase error message
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
};