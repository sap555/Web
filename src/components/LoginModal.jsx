import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { DEMO_USER } from '../data/mockData';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }
    setError('');
    onLoginSuccess(DEMO_USER);
    onClose();
  };

  const handleDemoFill = () => {
    setUsername('admin');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/40 border-b border-slate-800">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold text-white">เข้าสู่ระบบเจ้าหน้าที่</h2>
          <p className="text-xs text-slate-400 mt-1">
            ระบบสารสนเทศทะเบียนประชากรและขอบเขตพื้นที่หมู่บ้าน
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Demo Helper */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <span className="text-emerald-400 font-semibold">ทดลองใช้งาน:</span> User: <code className="text-white bg-slate-800 px-1 rounded">admin</code> | Pass: <code className="text-white bg-slate-800 px-1 rounded">123456</code>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs bg-emerald-700/50 hover:bg-emerald-600 text-white px-2 py-1 rounded-md transition"
            >
              เติมอัตโนมัติ
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg transition transform active:scale-95 text-sm"
            >
              ยืนยันเข้าสู่ระบบ
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
