import React, { useState, useEffect } from 'react';
import { kbService } from '../services/api';
import { KBFile } from '../types';
import {
  Database,
  Upload,
  Search,
  Trash2,
  FileText,
  FileSpreadsheet,
  File,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const [files, setFiles] = useState<KBFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchFiles = async () => {
    try {
      const list = await kbService.getAll();
      setFiles(list);
    } catch (err) {
      console.error('Failed to sync files registry', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const file = filesList[0];
      const payload = {
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        contentSummary: `Manual context for ${file.name}. Uploaded to Knowledge base.`
      };

      await kbService.upload(payload);
      setSuccessMsg(`Document "${file.name}" successfully indexed into agent database.`);
      fetchFiles();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to upload and index document.');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id: string, name: string) => {
    try {
      await kbService.delete(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      setSuccessMsg(`Document "${name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete selected file.');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-rose-400" size={18} />;
    if (type.includes('csv') || type.includes('excel') || type.includes('sheet')) return <FileSpreadsheet className="text-emerald-400" size={18} />;
    return <File className="text-brand-400" size={18} />;
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Knowledge Base Cabinet
        </h2>
        <p className="text-xs text-slate-400 mt-1">Upload company documentation, guidelines, CSV tables, and scripts for agents to query</p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Upload Portal */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Index new document</h3>
            
            <label className="border border-dashed border-slate-800 hover:border-brand-500/40 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all bg-slate-900/10 hover:bg-brand-500/5">
              <Upload className="text-slate-500" size={24} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-300">Click to upload file</p>
                <p className="text-[9px] text-slate-500">PDF, CSV, Word, or Excel</p>
              </div>
              <input
                type="file"
                disabled={uploading}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.csv,.xlsx,.xls,.txt"
              />
            </label>
          </div>
        </div>

        {/* Files registry */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 w-full max-w-sm">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search indexed files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-slate-100 focus:outline-none w-full"
            />
          </div>

          {/* Files grid */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-6">
            {filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">No documents found matching &ldquo;{searchQuery}&rdquo;. Upload a file to index it.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between hover:border-slate-700 transition-all">
                    <div className="flex items-start space-x-3 overflow-hidden">
                      <div className="mt-0.5 shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-200 truncate">{file.name}</h4>
                        <span className="text-[9px] text-slate-500">
                          {Math.round(file.size / 1024)} KB &bull; {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-2 italic line-clamp-2 leading-relaxed">
                          {file.contentSummary}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFile(file.id, file.name)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeBase;
