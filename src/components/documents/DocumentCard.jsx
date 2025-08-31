import React, { useState } from 'react';
import { Edit, Trash2, Clock, User, Tag, Sparkles, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export default function DocumentCard({ document, onEdit, onShowHistory }) {
  const { user } = useAuth();
  const { deleteDocument, generateSummary, generateTags, updateDocument } = useApp();
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const canEdit = user?.role === 'admin' || user?.id === document.createdBy;
  const canDelete = user?.role === 'admin' || user?.id === document.createdBy;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(document.id);
    }
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const summary = await generateSummary(document.content);
      await updateDocument(document.id, { summary });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    setLoadingTags(true);
    try {
      const tags = await generateTags(document.content);
      await updateDocument(document.id, { tags });
    } finally {
      setLoadingTags(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
          {document.title}
        </h3>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onShowHistory(document)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="View history"
          >
            <History className="w-4 h-4 text-slate-300" />
          </button>
          {canEdit && (
            <button
              onClick={() => onEdit(document)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Edit document"
            >
              <Edit className="w-4 h-4 text-slate-300" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Delete document"
            >
              <Trash2 className="w-4 h-4 text-red-300" />
            </button>
          )}
        </div>
      </div>

      <p className="text-slate-300 mb-4 leading-relaxed">
        {document.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {document.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{document.authorName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleGenerateSummary}
          disabled={loadingSummary}
          className="flex items-center space-x-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loadingSummary ? 'Generating...' : 'AI Summary'}</span>
        </button>
        <button
          onClick={handleGenerateTags}
          disabled={loadingTags}
          className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          <Tag className="w-4 h-4" />
          <span>{loadingTags ? 'Generating...' : 'AI Tags'}</span>
        </button>
      </div>
    </div>
  );
}