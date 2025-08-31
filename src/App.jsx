import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import AuthForm from './components/auth/AuthForm';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import SearchPage from './components/search/SearchPage';
import QATab from './components/qa/QATab';
import DocumentEditor from './components/documents/DocumentEditor';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  const [editingDocument, setEditingDocument] = useState(null);

  if (!user) {
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(mode => mode === 'login' ? 'register' : 'login')} 
      />
    );
  }

  const handleEditDocument = (doc) => {
    setEditingDocument(doc);
    setActiveTab('editor');
  };

  const handleCreateNew = () => {
    setEditingDocument(null);
    setActiveTab('editor');
  };

  const handleSaveDocument = () => {
    setEditingDocument(null);
    setActiveTab('dashboard');
  };

  const handleCancelEdit = () => {
    setEditingDocument(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onCreateNew={handleCreateNew} onEditDocument={handleEditDocument} />;
      case 'search':
        return <SearchPage onEditDocument={handleEditDocument} />;
      case 'qa':
        return <QATab />;
      case 'create':
        handleCreateNew();
        return null;
      case 'editor':
        return (
          <DocumentEditor
            document={editingDocument}
            onSave={handleSaveDocument}
            onCancel={handleCancelEdit}
          />
        );
      default:
        return <Dashboard onCreateNew={handleCreateNew} onEditDocument={handleEditDocument} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}