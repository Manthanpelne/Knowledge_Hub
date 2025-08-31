import React, { useState } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import DocumentCard from '../documents/DocumentCard';
import { Document } from '../../types';

interface SearchPageProps {
  onEditDocument: (doc: Document) => void;
}

export default function SearchPage({ onEditDocument }: SearchPageProps) {
  const { searchDocuments } = useApp();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'semantic'>('text');
  const [results, setResults] = useState<Document[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      const searchResults = searchDocuments(query, searchType);
      setResults(searchResults);
      setHasSearched(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search Knowledge Base</h1>
        <p className="text-slate-300">Find documents using text search or AI-powered semantic search</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search documents..."
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
          >
            Search
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Search type:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchType('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              Text Search
            </button>
            <button
              onClick={() => setSearchType('semantic')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                searchType === 'semantic'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Semantic Search</span>
            </button>
          </div>
        </div>
      </div>

      {hasSearched && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Search Results ({results.length})
          </h2>
          {searchType === 'semantic' && (
            <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-purple-300 text-sm">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Using AI-powered semantic search to find contextually relevant documents
              </p>
            </div>
          )}
        </div>
      )}

      {hasSearched && results.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-slate-300 mb-4">No documents found for "{query}"</p>
            <p className="text-slate-400 text-sm">
              Try adjusting your search terms or using semantic search for better results.
            </p>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onEdit={onEditDocument}
              onShowHistory={() => {}}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}