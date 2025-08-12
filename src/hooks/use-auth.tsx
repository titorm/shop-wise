
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import i18n from '@/lib/i18n';

interface Profile {
  display_name: string;
  email: string;
  family?: {
    adults: number;
    children: number;

    pets: number;
  };
  theme?: string;
  notifications?: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  reloadUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userRef = doc(db, Collections.Profile, user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Profile);
          } else {
            setProfile(null);
          }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const reloadUser = async () => {
    try {
        await auth.currentUser?.reload();
        setUser(auth.currentUser);
        if (auth.currentUser) {
            const userRef = doc(db, Collections.Profile, auth.currentUser.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data() as Profile);
            }
        }
    } catch(error) {
        console.error("Error reloading user:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const useRequireAuth = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    return { user, loading };
};
