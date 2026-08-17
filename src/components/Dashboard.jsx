import React from 'react';
import { Users, Home, MapPin, FileSpreadsheet, PlusCircle, ArrowUpRight, Shield, UserCheck, Activity, Award, FileText } from 'lucide-react';

export default function Dashboard({ 
  residents, 
  villages, 
  onNavigate, 
  onOpenAddResident,
  onOpenExportPdf,
  onResetData 
}) {

  // Calculate statistics
  const totalResidents = residents.length;
  
  // Unique house numbers
  const uniqueHouses = new Set(residents.map(r => `${r.moo}-${r.houseNo}`));
  const totalHouseholds = uniqueHouses.size;

  // Male & Female count
  const maleCount = residents.filter(r => r.gender === 'ชาย').length;
  const femaleCount = residents.filter(r => r.gender === 'หญิง').length;

  // Average Age
  const avgAge = totalResidents > 0 
    ? Math.round(residents.reduce((sum, r) => sum + (r.age || 0), 0) / totalResidents) 
    : 0;

  // Household Heads Count
  const householdHeadsCount = residents.filter(r => r.status === 'เจ้าบ้าน').length;

  return (
    <div className="space-y-4 animate-fade-in pb-4">
      
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white p-5 sm:p-6 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>ระบบบริการสารสนเทศประจำปี 2569</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ระบบจัดเก็บและวิเคราะห์ข้อมูลประชากรประจำหมู่บ้าน
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            บริหารจัดการสถิติประชากร บ้านเลขที่ และกำหนดเส้นขอบเขตพื้นที่ของแต่ละหมู่บ้านด้วยระบบแผนที่ดิจิทัล (GIS Boundary Drawer) พร้อมส่งออกรายงานรูปแบบ PDF ได้ทันที
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('residents')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 border-slate-700 rounded-xl font-medium text-sm shadow-md transition transform active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>ดูรายชื่อประชากรทั้งหมด</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm transition"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>เปิดแผนที่วาดขอบเขตหมู่บ้าน</span>
            </button>

            <button
              onClick={onOpenExportPdf}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 px-4 py-2.5 rounded-xl font-medium text-sm transition"
            >
              <FileText className="w-4 h-4" />
              <span>ส่งออกรายงาน PDF</span>
            </button>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <Home className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: Total Population */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ประชากรทั้งหมด</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalResidents} <span className="text-sm font-medium text-slate-500">คน</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500 space-x-2">
            <span className="text-emerald-700 font-medium bg-emerald-100 px-1.5 py-0.5 rounded">ชาย {maleCount}</span>
            <span className="text-pink-700 font-medium bg-pink-100 px-1.5 py-0.5 rounded">หญิง {femaleCount}</span>
          </div>
        </div>

        {/* Stat 2: Total Households */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">จำนวนครัวเรือน (บ้านเลขที่)</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalHouseholds} <span className="text-sm font-medium text-slate-500">หลัง</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span>เจ้าบ้านบันทึกแล้ว: <strong className="text-slate-800">{householdHeadsCount} คน</strong></span>
          </div>
        </div>

        {/* Stat 3: Total Villages/Moo */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">จำนวนหมู่บ้าน (หมู่ที่)</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{villages.length} <span className="text-sm font-medium text-slate-500">หมู่</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-purple-700 font-medium">
            <span>มีเส้นขอบเขตกำหนดแล้วครบถ้วน</span>
          </div>
        </div>

        {/* Stat 4: Average Age */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">อายุเฉลี่ยประชากร</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{avgAge} <span className="text-sm font-medium text-slate-500">ปี</span></h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span>กลุ่มวัยทำงานและผู้สูงอายุเป็นหลัก</span>
          </div>
        </div>

      </div>

      {/* Villages Overview Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">สรุปข้อมูลจำแนกตามหมู่บ้าน (หมู่ที่)</h3>
            <p className="text-xs text-slate-500">คลิกที่แต่ละหมู่บ้านเพื่อดูรายละเอียดประชากรหรือวาดขอบเขตแผนที่</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {villages.map((village) => {
            const villageResidents = residents.filter(r => r.moo === village.mooNumber);
            const villageHouseholds = new Set(villageResidents.map(r => r.houseNo)).size;
            
            return (
              <div 
                key={village.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" 
                      style={{ backgroundColor: village.color }}
                    >
                      หมู่ที่ {village.mooNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-400">ID: {village.id}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900">{village.name}</h4>
                  
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center space-x-1">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>ผู้ใหญ่บ้าน: <strong className="text-slate-800">{village.headman}</strong></span>
                    </p>
                    <p className="text-slate-500 pl-4">โทร: {village.headmanPhone}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="block text-[10px] font-semibold text-slate-500">ประชากร</span>
                      <span className="text-lg font-extrabold text-slate-800">{villageResidents.length} คน</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="block text-[10px] font-semibold text-slate-500">ครัวเรือน</span>
                      <span className="text-lg font-extrabold text-slate-800">{villageHouseholds} หลัง</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('residents', village.mooNumber)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <span>ดูรายชื่อชาวบ้าน</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={() => onNavigate('map')}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>ผังแผนที่</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Tools Footer Banner */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>ข้อมูลตัวอย่างได้รับการจัดเตรียมครบถ้วนตามมาตรฐานทะเบียนราษฎรระบบท้องถิ่น</span>
        </div>
        <button
          onClick={onResetData}
          className="text-slate-500 hover:text-red-600 underline font-medium"
        >
          คืนค่าข้อมูลตั้งต้น (Reset Demo Seed Data)
        </button>
      </div>

    </div>
  );
}
