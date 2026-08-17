import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ResidentManager from './components/ResidentManager';
import VillageMap from './components/VillageMap';
import LoginModal from './components/LoginModal';
import PdfExportModal from './components/PdfExportModal';
import { INITIAL_RESIDENTS, INITIAL_VILLAGES, DEMO_USER } from './data/mockData';

const safeReadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMooFilter, setSelectedMooFilter] = useState('ALL');
  const protectedTabs = ['residents', 'map'];

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => safeReadStorage('village_auth', false));

  const [currentUser, setCurrentUser] = useState(() => safeReadStorage('village_user', null));

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);

  // Residents & Villages Data State with localStorage persistence
  const [residents, setResidents] = useState(() => safeReadStorage('village_residents', INITIAL_RESIDENTS));

  const [villages, setVillages] = useState(() => safeReadStorage('village_boundaries', INITIAL_VILLAGES));

  // Resident Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResident, setEditingResident] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('village_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('village_boundaries', JSON.stringify(villages));
  }, [villages]);

  useEffect(() => {
    localStorage.setItem('village_auth', JSON.stringify(isLoggedIn));
    localStorage.setItem('village_user', JSON.stringify(currentUser));
  }, [isLoggedIn, currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('village_auth');
    localStorage.removeItem('village_user');
  };

  // Data Handlers
  const handleSaveResident = (residentData) => {
    if (!residentData || !residentData.id) return;

    const normalizedResident = {
      ...residentData,
      id: String(residentData.id).trim(),
      citizenId: String(residentData.citizenId || '').trim(),
      prefix: String(residentData.prefix || '').trim(),
      firstName: String(residentData.firstName || '').trim(),
      lastName: String(residentData.lastName || '').trim(),
      houseNo: String(residentData.houseNo || '').trim(),
      occupation: String(residentData.occupation || '').trim(),
      phone: String(residentData.phone || '').trim(),
      status: String(residentData.status || '').trim(),
      villageName: String(residentData.villageName || '').trim(),
      gender: residentData.gender || 'ชาย',
      age: Number.isFinite(Number(residentData.age)) ? Number(residentData.age) : 0,
      moo: Number(residentData.moo) || 1,
      lat: Number.isFinite(Number(residentData.lat)) ? Number(residentData.lat) : 0,
      lng: Number.isFinite(Number(residentData.lng)) ? Number(residentData.lng) : 0,
    };

    if (!normalizedResident.firstName || !normalizedResident.lastName || !normalizedResident.houseNo) {
      return;
    }

    setResidents(prev => {
      const existsIndex = prev.findIndex(r => r.id === normalizedResident.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = normalizedResident;
        return updated;
      }

      const duplicateCitizen = prev.find(r =>
        normalizedResident.citizenId &&
        r.citizenId &&
        r.citizenId === normalizedResident.citizenId
      );

      if (duplicateCitizen) {
        return prev;
      }

      return [normalizedResident, ...prev];
    });
  };

  const handleDeleteResident = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลชาวบ้านรายนี้ใช่หรือไม่?')) {
      setResidents(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveVillageBoundary = (villageId, newBoundary) => {
    setVillages(prev => prev.map(v => {
      if (v.id === villageId) {
        return { ...v, boundary: newBoundary };
      }
      return v;
    }));
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
      setResidents(INITIAL_RESIDENTS);
      setVillages(INITIAL_VILLAGES);
      localStorage.removeItem('village_residents');
      localStorage.removeItem('village_boundaries');
    }
  };

  const handleNavigateToMoo = (tab, mooNum) => {
    if (!isLoggedIn && protectedTabs.includes(tab)) {
      setIsLoginModalOpen(true);
      return;
    }

    setActiveTab(tab);
    if (mooNum) {
      setSelectedMooFilter(mooNum);
    }
  };

  const visibleTab = !isLoggedIn && protectedTabs.includes(activeTab) ? 'dashboard' : activeTab;

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={visibleTab}
        setActiveTab={(tab) => {
          if (!isLoggedIn && protectedTabs.includes(tab)) {
            setIsLoginModalOpen(true);
            return;
          }
          setActiveTab(tab);
        }}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 overflow-y-auto">
        <div className="mx-auto h-full flex flex-col">
          {visibleTab === 'dashboard' && (
            <Dashboard
              residents={residents}
              villages={villages}
              onNavigate={handleNavigateToMoo}
              onOpenAddResident={() => {
                if (!isLoggedIn) {
                  setIsLoginModalOpen(true);
                  return;
                }
                setEditingResident(null);
                setIsFormOpen(true);
              }}
              onOpenExportPdf={() => {
                if (!isLoggedIn) {
                  setIsLoginModalOpen(true);
                  return;
                }
                setIsPdfExportModalOpen(true);
              }}
              onResetData={handleResetData}
            />
          )}

          {visibleTab === 'residents' && isLoggedIn && (
            <ResidentManager
              residents={residents}
              villages={villages}
              selectedMooFilter={selectedMooFilter}
              setSelectedMooFilter={setSelectedMooFilter}
              onSaveResident={handleSaveResident}
              onDeleteResident={handleDeleteResident}
              isFormOpen={isFormOpen}
              setIsFormOpen={setIsFormOpen}
              editingResident={editingResident}
              setEditingResident={setEditingResident}
            />
          )}

          {visibleTab === 'map' && isLoggedIn && (
            <VillageMap
              villages={villages}
              residents={residents}
              onSaveVillageBoundary={handleSaveVillageBoundary}
              onOpenExportPdf={() => setIsPdfExportModalOpen(true)}
            />
          )}

          {!isLoggedIn && activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-full min-h-[260px] rounded-2xl border border-dashed border-slate-300 bg-white/80 text-slate-600">
              <div className="text-center max-w-md px-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">กรุณาเข้าสู่ระบบก่อนใช้งาน</h3>
                <p className="text-sm text-slate-500 mb-4">ส่วนนี้ต้องการการยืนยันตัวตนเพื่อเข้าถึงข้อมูลประชากรและแผนที่หมู่บ้าน</p>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium"
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        villages={villages}
        residents={residents}
        currentUser={currentUser}
      />

    </div>
  );
}
