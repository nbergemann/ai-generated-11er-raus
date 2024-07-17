import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, signInAnonymously, updateProfile } from 'firebase/auth';

export class AuthService {
  async signInAnonymously(): Promise<User> {
      return (await signInAnonymously(this.auth)).user;
  }
  private auth = getAuth();

  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  async signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback);
  }

  async updateProfile(user: User, profile: { displayName?: string; photoURL?: string }): Promise<void> {
    await updateProfile(user, profile);
  }
}