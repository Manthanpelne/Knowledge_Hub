import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Sparkles, Tag as TagIcon } from 'lucide-react';
import { Document } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface DocumentEditorProps {
  document?: Document;
  onSave: () => void;
  onCancel: () => void;
}

export default function DocumentEditor({ document, onSave, onCancel }: DocumentEditorProps) {
  const { createDocument, updateDocument, generateSummary, generateTags } = useApp();
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [summary, setSummary] = useState(document?.summary || '');
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const isEditing = !!document;

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    try {
      if (isEditing) {
        await updateDocument(document.id, { 
          title: title.trim(), 
          content: content.trim(), 
          tags, 
          summary 
        });
      } else {
        await createDocument(title.trim(), content.trim());
      }
      onSave();
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) return;
    
    setLoadingSummary(true);
    try {
      const newSummary = await generateSummary(content);
      setSummary(newSummary);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!content.trim()) return;
    
    setLoadingTags(true);
    try {
      const newTags = await generateTags(content);
      setTags(newTags);
    } finally {
      setLoadingTags(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Document' : 'Create New Document'}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim() || !content.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Document'}</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter document title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your document content here..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Summary
              </label>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingSummary || !content.trim()}
                className="flex items-center space-x-1 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingSummary ? 'Generating...' : 'AI Summary'}</span>
              </button>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Document summary..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Tags
              </label>
              <button
                onClick={handleGenerateTags}
                disabled={loadingTags || !content.trim()}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <TagIcon className="w-4 h-4" />
                <span>{loadingTags ? 'Generating...' : 'AI Tags'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm cursor-pointer hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  onClick={() => removeTag(tag)}
                  title="Click to remove"
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}