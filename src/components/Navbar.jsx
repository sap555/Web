import React from 'react';
import { LayoutDashboard, Users, MapPin, FileText, LogIn, LogOut, ShieldCheck, Home } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isLoggedIn, currentUser, onOpenLogin, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Portal Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-emerald-400">
                ระบบจัดการข้อมูลประชากร & ขอบเขตหมู่บ้าน
              </h1>
              <p className="text-xs text-slate-400 font-normal">
                {currentUser?.villageSubdistrict || 'ตำบลเขาใหญ่ อำเภอปากช่อง จังหวัดนครราชสีมา'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>แดชบอร์ด</span>
            </button>

            <button
              onClick={() => setActiveTab('residents')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'residents'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ทะเบียนประชากร & บ้านเลขที่</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>แผนที่ขอบเขตหมู่บ้าน</span>
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-700">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-xs border border-emerald-500/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-200">{currentUser?.name}</p>
                  <p className="text-[10px] text-emerald-400">{currentUser?.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  title="ออกจากระบบ"
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md transition-all transform active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-1 ${activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>แดชบอร์ด</span>
          </button>
          <button
            onClick={() => setActiveTab('residents')}
            className={`flex flex-col items-center p-1 ${activeTab === 'residents' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            <Users className="w-5 h-5" />
            <span>รายชื่อ</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center p-1 ${activeTab === 'map' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            <MapPin className="w-5 h-5" />
            <span>แผนที่</span>
          </button>
        </div>

      </div>
    </header>
  );
}
