import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ResidentManager from './components/ResidentManager';
import VillageMap from './components/VillageMap';
import LoginModal from './components/LoginModal';
import PdfExportModal from './components/PdfExportModal';
import { INITIAL_RESIDENTS, INITIAL_VILLAGES, DEMO_USER } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMooFilter, setSelectedMooFilter] = useState('ALL');

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem('village_auth');
    return savedAuth ? JSON.parse(savedAuth) : true; // Default logged in for demo
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('village_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USER;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);

  // Residents & Villages Data State with localStorage persistence
  const [residents, setResidents] = useState(() => {
    const saved = localStorage.getItem('village_residents');
    return saved ? JSON.parse(saved) : INITIAL_RESIDENTS;
  });

  const [villages, setVillages] = useState(() => {
    const saved = localStorage.getItem('village_boundaries');
    return saved ? JSON.parse(saved) : INITIAL_VILLAGES;
  });

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
  };

  // Data Handlers
  const handleSaveResident = (residentData) => {
    setResidents(prev => {
      const existsIndex = prev.findIndex(r => r.id === residentData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = residentData;
        return updated;
      } else {
        return [residentData, ...prev];
      }
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
    setActiveTab(tab);
    if (mooNum) {
      setSelectedMooFilter(mooNum);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto h-full flex flex-col">
          {activeTab === 'dashboard' && (
            <Dashboard
              residents={residents}
              villages={villages}
              onNavigate={handleNavigateToMoo}
              onOpenAddResident={() => {
                setEditingResident(null);
                setIsFormOpen(true);
              }}
              onOpenExportPdf={() => setIsPdfExportModalOpen(true)}
              onResetData={handleResetData}
            />
          )}

          {activeTab === 'residents' && (
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

          {activeTab === 'map' && (
            <VillageMap
              villages={villages}
              residents={residents}
              onSaveVillageBoundary={handleSaveVillageBoundary}
              onOpenExportPdf={() => setIsPdfExportModalOpen(true)}
            />
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
