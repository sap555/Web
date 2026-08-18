import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, Home, Download, 
  X, Check, MapPin, Phone, UserCheck, ChevronRight
} from 'lucide-react';
import { INITIAL_RESIDENTS } from '../data/mockData';
import { saveResidentToGoogleSheets } from '../services/googleSheets';

const normalizeResidentData = (resident) => ({
  ...resident,
  citizenId: String(resident.citizenId || '').trim(),
  prefix: String(resident.prefix || '').trim(),
  firstName: String(resident.firstName || '').trim(),
  lastName: String(resident.lastName || '').trim(),
  houseNo: String(resident.houseNo || '').trim(),
  occupation: String(resident.occupation || '').trim(),
  phone: String(resident.phone || '').trim(),
  status: String(resident.status || '').trim(),
  villageName: String(resident.villageName || '').trim(),
  gender: resident.gender || 'ชาย',
  age: Number.isFinite(Number(resident.age)) ? Number(resident.age) : 0,
  moo: Number(resident.moo) || 1,
  lat: Number.isFinite(Number(resident.lat)) ? Number(resident.lat) : 0,
  lng: Number.isFinite(Number(resident.lng)) ? Number(resident.lng) : 0,
});

const validateResidentData = (resident, villages = [], allResidents = [], currentId = null) => {
  const normalized = normalizeResidentData(resident);

  if (!normalized.firstName) return 'กรุณากรอกชื่อ';
  if (!normalized.lastName) return 'กรุณากรอกนามสกุล';
  if (!normalized.houseNo) return 'กรุณากรอกบ้านเลขที่';
  if (!normalized.moo || normalized.moo < 1) return 'หมู่ที่ไม่ถูกต้อง';

  const selectedVillage = normalized.moo && villages.some(v => v.mooNumber === normalized.moo);
  if (!selectedVillage) return 'หมู่ที่ที่เลือกไม่มีอยู่ในระบบ';

  if (!Number.isInteger(normalized.age) || normalized.age < 0 || normalized.age > 120) {
    return 'อายุต้องเป็นตัวเลขตั้งแต่ 0 ถึง 120 ปี';
  }

  if (normalized.citizenId) {
    const citizenPattern = /^\d[\d-]{8,20}$/;
    if (!citizenPattern.test(normalized.citizenId.replace(/\s+/g, ''))) {
      return 'เลขบัตรประชาชนไม่ถูกต้อง';
    }
  }

  if (normalized.phone) {
    const phonePattern = /^[0-9\-+()\s]{8,15}$/;
    if (!phonePattern.test(normalized.phone)) {
      return 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }
  }

  const duplicate = allResidents.find(existing => {
    if (currentId && existing.id === currentId) return false;
    if (normalized.citizenId && existing.citizenId && existing.citizenId === normalized.citizenId) {
      return true;
    }
    return existing.firstName === normalized.firstName &&
      existing.lastName === normalized.lastName &&
      existing.houseNo === normalized.houseNo &&
      existing.moo === normalized.moo;
  });

  if (duplicate) {
    return 'ข้อมูลชาวบ้านนี้มีอยู่แล้วในระบบ';
  }

  return null;
};

export default function ResidentManager({ 
  villages, 
  selectedMooFilter,
  setSelectedMooFilter,
  isFormOpen,
  setIsFormOpen,
  editingResident,
  setEditingResident
}) {
  const [residents, setResidents] = useState(INITIAL_RESIDENTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    citizenId: '',
    prefix: 'นาย',
    firstName: '',
    lastName: '',
    gender: 'ชาย',
    age: '',
    houseNo: '',
    moo: 1,
    villageName: 'บ้านดอนงาม',
    occupation: '',
    phone: 'xxx-xxx-xxxx',
    status: 'เจ้าบ้าน',
    lat: 14.5310,
    lng: 100.9180
  });

  const [formError, setFormError] = useState('');

  // Persist residents to localStorage
  React.useEffect(() => {
    localStorage.setItem('village_residents', JSON.stringify(residents));
  }, [residents]);

  // Handle save resident
  const handleSaveResident = async (residentData) => {
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

    await saveResidentToGoogleSheets(normalizedResident);
  };

  // Handle delete resident
  const handleDeleteResident = (residentId) => {
    setResidents(prev => prev.filter(r => r.id !== residentId));
  };

  // Handle open modal for new or editing
  const handleOpenAddModal = () => {
    setEditingResident(null);
    setFormData({
      id: `res-${Date.now()}`,
      citizenId: '',
      prefix: 'นาย',
      firstName: '',
      lastName: '',
      gender: 'ชาย',
      age: 30,
      houseNo: '',
      moo: selectedMooFilter === 'ALL' ? 1 : Number(selectedMooFilter),
      villageName: villages.find(v => v.mooNumber === (selectedMooFilter === 'ALL' ? 1 : Number(selectedMooFilter)))?.name || 'บ้านดอนงาม',
      occupation: 'เกษตรกร',
      phone: 'xxx-xxx-xxxx',
      status: 'เจ้าบ้าน',
      lat: 14.5320,
      lng: 100.9250
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (resident) => {
    setEditingResident(resident);
    setFormData({ ...resident });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleMooChangeInForm = (mooNum) => {
    const village = villages.find(v => v.mooNumber === Number(mooNum));
    setFormData(prev => ({
      ...prev,
      moo: Number(mooNum),
      villageName: village ? village.name : `หมู่ที่ ${mooNum}`
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const validationMessage = validateResidentData(formData, villages, residents, editingResident?.id);
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    const cleanedResident = normalizeResidentData(formData);
    handleSaveResident(cleanedResident);
    setFormError('');
    setIsFormOpen(false);
  };

  // Filtered residents list
  const filteredResidents = useMemo(() => {
    return residents.filter(r => {
      const matchMoo = selectedMooFilter === 'ALL' || r.moo === Number(selectedMooFilter);
      const query = searchTerm.toLowerCase().trim();
      const matchQuery = !query || 
        r.firstName.toLowerCase().includes(query) ||
        r.lastName.toLowerCase().includes(query) ||
        r.houseNo.toLowerCase().includes(query) ||
        r.citizenId.toLowerCase().includes(query) ||
        r.occupation.toLowerCase().includes(query) ||
        (r.phone && r.phone.includes(query));

      return matchMoo && matchQuery;
    });
  }, [residents, selectedMooFilter, searchTerm]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "เลขบัตรประชาชน", "คำนำหน้า", "ชื่อ", "นามสกุล", "เพศ", "อายุ", "บ้านเลขที่", "หมู่ที่", "ชื่อหมู่บ้าน", "อาชีพ", "เบอร์โทร", "สถานะ"];
    const rows = filteredResidents.map(r => [
      r.id, r.citizenId, r.prefix, r.firstName, r.lastName, r.gender, r.age,
      `"${r.houseNo}"`, r.moo, r.villageName, r.occupation, r.phone, r.status
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `รายชื่อประชากร_หมู่${selectedMooFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in pb-2">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-0.5">
            <Users className="w-4 h-4" />
            <span>ทะเบียนราษฎรประจำหมู่บ้าน</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">จัดการข้อมูลประชากรและบ้านเลขที่</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            ค้นหา ตรวจสอบ คลังรายชื่อชาวบ้าน และปรับปรุงข้อมูลรายครัวเรือน
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มข้อมูลประชากร</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        
        {/* Moo Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 px-2 flex items-center shrink-0">
            <Filter className="w-3.5 h-3.5 mr-1" /> หมู่ที่:
          </span>
          <button
            onClick={() => setSelectedMooFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              selectedMooFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด ({residents.length})
          </button>

          {villages.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedMooFilter(v.mooNumber)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shrink-0 ${
                Number(selectedMooFilter) === v.mooNumber
                  ? 'text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              style={{
                backgroundColor: Number(selectedMooFilter) === v.mooNumber ? v.color : undefined
              }}
            >
              <span>หมู่ {v.mooNumber}</span>
              <span className="opacity-80 text-[10px]">
                ({residents.filter(r => r.moo === v.mooNumber).length})
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w- md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา ชื่อ, บ้านเลขที่..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[300px]">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center">บ้านเลขที่</th>
                <th className="py-3.5 px-4">หมู่ที่ / ชื่อหมู่บ้าน</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">เพศ/อายุ</th>
                <th className="py-3.5 px-4">อาชีพ</th>
                <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredResidents.length > 0 ? (
                filteredResidents.map((r) => {
                  const villageObj = villages.find(v => v.mooNumber === r.moo);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* House No */}
                      <td className="py-3 px-4 text-center">
                        <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {r.houseNo}
                        </span>
                      </td>

                      {/* Village & Moo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: villageObj?.color || '#10B981' }}
                          />
                          <div>
                            <p className="font-bold text-slate-800">หมู่ {r.moo}</p>
                            <p className="text-[10px] text-slate-400">{r.villageName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {r.prefix} {r.firstName} {r.lastName}
                      </td>
                      
                      {/* Gender & Age */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.gender === 'ชาย' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                        }`}>
                          {r.gender} ({r.age} ปี)
                        </span>
                      </td>

                      {/* Occupation */}
                      <td className="py-3 px-4 text-slate-600">
                        {r.occupation || '-'}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 text-slate-600">
                        {r.phone ? (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{r.phone}</span>
                          </span>
                        ) : '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          r.status === 'เจ้าบ้าน'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(r)}
                            title="แก้ไขข้อมูล"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteResident(r.id)}
                            title="ลบข้อมูล"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">ไม่พบข้อมูลประชากรตามเงื่อนไขค้นหา</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer Count */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>แสดงทั้งหมด {filteredResidents.length} รายการ</span>
          <span>กรองโดย: หมู่ที่ {selectedMooFilter}</span>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingResident ? 'แก้ไขข้อมูลชาวบ้าน' : 'เพิ่มข้อมูลประชากรใหม่'}
                  </h3>
                  <p className="text-[11px] text-slate-400">บันทึกข้อมูลเข้าสู่ระบบทะเบียนประจำหมู่บ้าน</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Moo Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หมู่ที่ *</label>
                  <select
                    value={formData.moo}
                    onChange={(e) => handleMooChangeInForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {villages.map(v => (
                      <option key={v.id} value={v.mooNumber}>
                        หมู่ที่ {v.mooNumber} - {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* House No */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">บ้านเลขที่ *</label>
                  <input
                    type="text"
                    required
                    value={formData.houseNo}
                    onChange={(e) => setFormData(p => ({ ...p, houseNo: e.target.value }))}
                    placeholder="เช่น 12/1 หรือ 45"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">สถานะในบ้าน</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="เจ้าบ้าน">เจ้าบ้าน</option>
                    <option value="ผู้อยู่อาศัย">ผู้อยู่อาศัย</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Prefix */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">คำนำหน้า</label>
                  <select
                    value={formData.prefix}
                    onChange={(e) => setFormData(p => ({ ...p, prefix: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="สมชาย"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="ใจดี"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เพศ</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(p => ({ ...p, gender: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(p => ({ ...p, age: Number(e.target.value) }))}
                    placeholder="45"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="081-XXX-XXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">อาชีพปัจจุบัน</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData(p => ({ ...p, occupation: e.target.value }))}
                  placeholder="เกษตรกร, ค้าขาย, รับราชการ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Coordinates */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs font-bold text-slate-700 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  พิกัดบ้านพักบนแผนที่ (Latitude / Longitude)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData(p => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData(p => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  บันทึกข้อมูล
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
