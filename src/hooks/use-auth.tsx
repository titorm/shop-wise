
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, DocumentReference, Timestamp } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import i18n from '@/lib/i18n';

interface Profile {
  uid: string;
  displayName: string;
  email: string;
  familyId: string | null; 
  family?: {
    adults: number;
    children: number;
    pets: number;
  };
  settings?: {
    theme: string;
    notifications: boolean;
  };
  isAdmin?: boolean;
  plan?: string;
  planExpirationDate?: Timestamp;
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

  const fetchUserProfile = async (user: User) => {
    try {
        const userRef = doc(db, Collections.Users, user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const familyIdString = typeof userData.familyId === 'string' ? userData.familyId : (userData.familyId as DocumentReference)?.id || null;

            const profileData: Profile = {
                uid: user.uid,
                displayName: userData.displayName,
                email: userData.email,
                familyId: familyIdString,
                settings: userData.settings,
                isAdmin: userData.isAdmin,
                plan: userData.plan || 'free',
                planExpirationDate: userData.planExpirationDate,
            };

            // Fetch family data if familyId exists
            if (familyIdString) {
                const familyRef = doc(db, Collections.Families, familyIdString);
                const familySnap = await getDoc(familyRef);
                if (familySnap.exists()) {
                    profileData.family = familySnap.data().familyComposition;
                }
            }
            setProfile(profileData);
        } else {
            setProfile(null);
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfile(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const reloadUser = async () => {
    setLoading(true);
    try {
        await auth.currentUser?.reload();
        const currentUser = auth.currentUser;
        setUser(currentUser);
        if (currentUser) {
            await fetchUserProfile(currentUser);
        }
    } catch(error) {
        console.error("Error reloading user:", error);
    } finally {
        setLoading(false);
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
