import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Document, Activity, QAEntry } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  documents: Document[];
  activities: Activity[];
  qaEntries: QAEntry[];
  createDocument: (title: string, content: string) => Promise<Document>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  searchDocuments: (query: string, type: 'text' | 'semantic') => Document[];
  generateSummary: (content: string) => Promise<string>;
  generateTags: (content: string) => Promise<string[]>;
  askQuestion: (question: string) => Promise<QAEntry>;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [qaEntries, setQAEntries] = useState<QAEntry[]>([]);

  useEffect(() => {
    // Load mock data
    const mockDocs: Document[] = [
      {
        id: '1',
        title: 'Project Setup Guide',
        content: 'This document outlines the step-by-step process for setting up new projects in our development environment. It covers environment configuration, dependency management, and initial project structure.',
        tags: ['setup', 'development', 'guide'],
        summary: 'Comprehensive guide for setting up new development projects with environment configuration and dependency management.',
        createdBy: '1',
        authorName: 'Admin User',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
        versions: []
      },
      {
        id: '2',
        title: 'API Documentation Standards',
        content: 'Our team follows specific standards for API documentation to ensure consistency and clarity. This includes endpoint descriptions, parameter definitions, response examples, and error handling patterns.',
        tags: ['api', 'documentation', 'standards'],
        summary: 'Team standards for creating clear and consistent API documentation with examples and error handling.',
        createdBy: '2',
        authorName: 'Regular User',
        createdAt: '2024-12-02T14:30:00Z',
        updatedAt: '2024-12-02T14:30:00Z',
        versions: []
      }
    ];

    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'created',
        documentId: '1',
        documentTitle: 'Project Setup Guide',
        userId: '1',
        userName: 'Admin User',
        timestamp: '2024-12-01T10:00:00Z'
      },
      {
        id: '2',
        type: 'created',
        documentId: '2',
        documentTitle: 'API Documentation Standards',
        userId: '2',
        userName: 'Regular User',
        timestamp: '2024-12-02T14:30:00Z'
      }
    ];

    setDocuments(mockDocs);
    setActivities(mockActivities);
  }, []);

  const createDocument = async (title: string, content: string): Promise<Document> => {
    if (!user) throw new Error('User not authenticated');

    const summary = await generateSummary(content);
    const tags = await generateTags(content);

    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      tags,
      summary,
      createdBy: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: []
    };

    setDocuments(prev => [newDoc, ...prev]);
    addActivity({
      type: 'created',
      documentId: newDoc.id,
      documentTitle: newDoc.title,
      userId: user.id,
      userName: user.name
    });

    return newDoc;
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        // Create version history entry
        const version = {
          id: Math.random().toString(36).substr(2, 9),
          title: doc.title,
          content: doc.content,
          tags: doc.tags,
          summary: doc.summary,
          timestamp: doc.updatedAt,
          editedBy: doc.createdBy,
          editorName: doc.authorName
        };

        const updatedDoc = {
          ...doc,
          ...updates,
          updatedAt: new Date().toISOString(),
          versions: [version, ...doc.versions]
        };

        addActivity({
          type: 'updated',
          documentId: id,
          documentTitle: updatedDoc.title,
          userId: user.id,
          userName: user.name
        });

        return updatedDoc;
      }
      return doc;
    }));
  };

  const deleteDocument = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const doc = documents.find(d => d.id === id);
    if (doc) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      addActivity({
        type: 'deleted',
        documentId: id,
        documentTitle: doc.title,
        userId: user.id,
        userName: user.name
      });
    }
  };

  const searchDocuments = (query: string, type: 'text' | 'semantic'): Document[] => {
    if (!query.trim()) return documents;

    return documents.filter(doc => {
      const searchFields = [doc.title, doc.content, doc.summary, ...doc.tags].join(' ').toLowerCase();
      
      if (type === 'text') {
        return searchFields.includes(query.toLowerCase());
      } else {
        // Simulate semantic search with keyword matching and relevance scoring
        const keywords = query.toLowerCase().split(' ');
        return keywords.some(keyword => searchFields.includes(keyword));
      }
    });
  };

  const generateSummary = async (content: string): Promise<string> => {
    // Simulate AI summarization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sentences = content.split('.').filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return content.trim();
    
    return sentences.slice(0, 2).join('.').trim() + '.';
  };

  const generateTags = async (content: string): Promise<string[]> => {
    // Simulate AI tag generation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    const wordFreq = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const askQuestion = async (question: string): Promise<QAEntry> => {
    if (!user) throw new Error('User not authenticated');
    
    // Simulate AI Q&A
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const relevantDocs = documents.filter(doc => {
      const searchText = [doc.title, doc.content, doc.summary].join(' ').toLowerCase();
      const questionWords = question.toLowerCase().split(' ');
      return questionWords.some(word => searchText.includes(word));
    });
    
    const sources = relevantDocs.map(doc => doc.title);
    const answer = relevantDocs.length > 0
      ? `Based on the available documents, here's what I found: ${relevantDocs[0].summary} This information comes from our knowledge base and may need verification for specific use cases.`
      : 'I couldn\'t find relevant information in the current knowledge base to answer this question. Consider adding more detailed documentation on this topic.';
    
    const qaEntry: QAEntry = {
      id: Math.random().toString(36).substr(2, 9),
      question,
      answer,
      sources,
      askedBy: user.id,
      askerName: user.name,
      timestamp: new Date().toISOString()
    };
    
    setQAEntries(prev => [qaEntry, ...prev]);
    return qaEntry;
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  return (
    <AppContext.Provider value={{
      documents,
      activities,
      qaEntries,
      createDocument,
      updateDocument,
      deleteDocument,
      searchDocuments,
      generateSummary,
      generateTags,
      askQuestion,
      addActivity
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}