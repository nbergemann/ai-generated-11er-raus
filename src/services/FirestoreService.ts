// src/services/FirestoreService.ts

import { getFirestore, doc, setDoc, addDoc, deleteDoc, onSnapshot, collection, Firestore, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { app } from '../firebase-config';

export class FirestoreService {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(app);
  }

  async updateDocument<T extends DocumentData>(path: string, data: Partial<T>): Promise<void> {
    await setDoc(doc(this.db, path), data, { merge: true });
  }

  async addDocument<T extends DocumentData>(collectionPath: string, data: T): Promise<string> {
    const docRef = await addDoc(collection(this.db, collectionPath), data);
    return docRef.id;
  }

  async deleteDocument(path: string): Promise<void> {
    await deleteDoc(doc(this.db, path));
  }

  listenToDocument<T extends DocumentData>(path: string, callback: (data: T | null) => void): () => void {
    return onSnapshot(doc(this.db, path), (snapshot) => {
      callback(snapshot.data() as T | null);
    });
  }

  listenToCollection<T extends DocumentData>(
    collectionPath: string, 
    callback: (data: (T & { id: string })[]) => void
  ): () => void {
    return onSnapshot(collection(this.db, collectionPath), (snapshot) => {
      const data = snapshot.docs.map(this.convertDocument<T>);
      callback(data);
    });
  }

  private convertDocument<T extends DocumentData>(doc: QueryDocumentSnapshot<DocumentData>): T & { id: string } {
    const data = doc.data() as T;
    return {
      ...data,
      id: doc.id
    };
  }
}