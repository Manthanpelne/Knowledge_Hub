import React from 'react';
import { X, Clock, User } from 'lucide-react';

export default function DocumentHistoryModal({ document, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Document History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Current Version</h3>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-4 text-sm text-slate-300 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{document.authorName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(document.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              <h4 className="font-semibold text-white mb-2">{document.title}</h4>
              <p className="text-slate-300 text-sm mb-3">{document.summary}</p>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {document.versions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Previous Versions</h3>
              <div className="space-y-4">
                {document.versions.map((version, index) => (
                  <div
                    key={version.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                      <span className="text-slate-500">Version {document.versions.length - index}</span>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{version.editorName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-200 mb-2">{version.title}</h4>
                    <p className="text-slate-400 text-sm mb-3">{version.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {version.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-500/20 text-slate-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {document.versions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400">No previous versions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}