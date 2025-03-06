import { useContext, createContext, type PropsWithChildren, useState } from 'react';
import { useStorageState } from '../useStorageState';

type User = {
  email: string;
  name: string;
};

const AuthContext = createContext<{
  signIn: (token: string | null) => void;
  signOut: () => void;
  setUser: (user: User | null) => void;
  session?: string | null;
  user?: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  setUser: () => {},
  session: null,
  user: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          // Perform sign-in logic here
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        user,
        setUser,
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
