import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { Word } from '../types/vocabulary';
import { useAuth } from './AuthContext';

interface VocabularyContextType {
  words: Word[];
  loading: boolean;
  addWord: (word: Omit<Word, 'id' | 'createdAt' | 'reviewCount' | 'correctCount'>) => Promise<void>;
  updateWord: (id: string, word: Partial<Word>) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  getWordsByLanguage: (language: string) => Word[];
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWords();
    } else {
      setWords([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWords = async () => {
    if (!user) return;
    
    try {
      const wordsRef = collection(db, 'users', user.uid, 'words');
      const q = query(wordsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const wordsData: Word[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        wordsData.push({
          id: doc.id,
          original: data.original,
          translation: data.translation,
          language: data.language,
          example: data.example,
          category: data.category,
          difficulty: data.difficulty,
          createdAt: data.createdAt.toDate(),
          lastReviewed: data.lastReviewed?.toDate(),
          reviewCount: data.reviewCount || 0,
          correctCount: data.correctCount || 0,
        });
      });
      
      setWords(wordsData);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (wordData: Omit<Word, 'id' | 'createdAt' | 'reviewCount' | 'correctCount'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const wordsRef = collection(db, 'users', user.uid, 'words');
      const newWord = {
        ...wordData,
        createdAt: new Date(),
        reviewCount: 0,
        correctCount: 0,
      };
      
      await addDoc(wordsRef, newWord);
      await fetchWords();
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  };

  const updateWord = async (id: string, wordData: Partial<Word>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const wordRef = doc(db, 'users', user.uid, 'words', id);
      const updateData = {
        ...wordData,
        lastReviewed: wordData.lastReviewed ? new Date(wordData.lastReviewed) : undefined,
      };
      
      await updateDoc(wordRef, updateData);
      await fetchWords();
    } catch (error) {
      console.error('Error updating word:', error);
      throw error;
    }
  };

  const deleteWord = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const wordRef = doc(db, 'users', user.uid, 'words', id);
      await deleteDoc(wordRef);
      await fetchWords();
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  };

  const getWordsByLanguage = (language: string): Word[] => {
    return words.filter(word => word.language === language);
  };

  const value = {
    words,
    loading,
    addWord,
    updateWord,
    deleteWord,
    getWordsByLanguage,
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};
