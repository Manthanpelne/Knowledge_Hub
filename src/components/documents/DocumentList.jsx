import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import DocumentCard from './DocumentCard';
import DocumentHistoryModal from './DocumentHistoryModal';

export default function DocumentList({ onCreateNew, onEditDocument }) {
  const { documents } = useApp();
  const [selectedTags, setSelectedTags] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Get all unique tags
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));

  const filteredDocuments = documents.filter(doc => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => doc.tags.includes(tag));
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleShowHistory = (doc) => {
    setSelectedDocument(doc);
    setShowHistoryModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
          <p className="text-slate-300">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>New Document</span>
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Filter by tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-slate-300 mb-4">No documents found</p>
            <button
              onClick={onCreateNew}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create your first document
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEditDocument}
              onShowHistory={handleShowHistory}
            />
          ))}
        </div>
      )}

      {showHistoryModal && selectedDocument && (
        <DocumentHistoryModal
          document={selectedDocument}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}