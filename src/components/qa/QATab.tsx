import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, User, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function QATab() {
  const { qaEntries, askQuestion } = useApp();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    try {
      await askQuestion(question);
      setQuestion('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team Q&A</h1>
        <p className="text-slate-300">Ask questions and get AI-powered answers based on your team's knowledge base</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Ask AI Assistant</h2>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your team's documents..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Asking...' : 'Ask'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {qaEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
              <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-4">No questions asked yet</p>
              <p className="text-slate-400 text-sm">
                Ask your first question to get AI-powered answers from your team's knowledge base.
              </p>
            </div>
          </div>
        ) : (
          qaEntries.map((qa) => (
            <div key={qa.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{qa.askerName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(qa.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-white font-medium">{qa.question}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">AI Assistant</span>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-slate-300 leading-relaxed">{qa.answer}</p>
                </div>
              </div>

              {qa.sources.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {qa.sources.map((source, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}