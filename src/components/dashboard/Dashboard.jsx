import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import DocumentList from '../documents/DocumentList';

export default function Dashboard({ onCreateNew, onEditDocument }) {
  const { documents } = useApp();
  const { user } = useAuth();

  const stats = {
    totalDocs: documents.length,
    myDocs: documents.filter(doc => doc.createdBy === user?.id).length,
    recentDocs: documents.filter(doc => {
      const daysDiff = (Date.now() - new Date(doc.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Total Documents</h3>
            <p className="text-3xl font-bold text-white">{stats.totalDocs}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">My Documents</h3>
            <p className="text-3xl font-bold text-blue-400">{stats.myDocs}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Recent Updates</h3>
            <p className="text-3xl font-bold text-green-400">{stats.recentDocs}</p>
          </div>
        </div>
      </div>
      
      <DocumentList onCreateNew={onCreateNew} onEditDocument={onEditDocument} />
    </div>
  );
}