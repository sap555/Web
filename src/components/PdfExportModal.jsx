import React, { useRef, useState } from 'react';
import { X, Download, Printer, Shield, CheckCircle2, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PdfExportModal({ isOpen, onClose, villages, residents, currentUser }) {
  const reportRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportMode, setExportMode] = useState('full');

  if (!isOpen) return null;

  const totalResidents = residents.length;
  const uniqueHouses = new Set(residents.map(r => `${r.moo}-${r.houseNo}`));
  const totalHouseholds = uniqueHouses.size;
  const currentDateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const modeLabel = exportMode === 'full' ? 'เต็ม' : 'สรุปไม่รวมรายชื่อ';
      pdf.save(`รายงานประชากร_และแผนที่ขอบเขตหมู่บ้าน_${modeLabel}_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-800 text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">ส่งออกเอกสารรายงานระบบสารสนเทศประจำหมู่บ้าน (PDF Report)</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}</span>
            </button>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2 bg-slate-950 border-b border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setExportMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                exportMode === 'full'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              ตัวเลือกที่ 1: รายงานเต็ม
            </button>
            <button
              type="button"
              onClick={() => setExportMode('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                exportMode === 'summary'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              ตัวเลือกที่ 2: ไม่รวมรายชื่อราษฎร
            </button>
          </div>
        </div>

        {/* PDF Preview Document Area */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          
          {/* A4 Paper Template */}
          <div 
            ref={reportRef}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-10 shadow-2xl border border-slate-200 rounded-sm space-y-6 text-sm font-sans"
            style={{ fontFamily: "'Prompt', 'Sarabun', sans-serif" }}
          >
            {/* Official Report Header */}
            <div className="border-b-2 border-emerald-800 pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-emerald-950">
                  รายงานสรุปสารสนเทศประชากร บ้านเลขที่ และผังขอบเขตหมู่บ้าน
                </h1>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {currentUser?.villageSubdistrict || 'ตำบลเขาใหญ่ อำอปักช่อง จังหวัดนครราชสีมา'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ประจำวันที่: {currentDateStr}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded border border-emerald-300">
                  เอกสารสรุปราชการท้องถิ่น
                </span>
                <p className="text-[10px] text-slate-400 mt-1">เจ้าหน้าที่: {currentUser?.name || 'ผู้ดูแลระบบ'}</p>
              </div>
            </div>

            {/* Key Summary Stat Highlights */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">ประชากรทั้งหมด</span>
                <span className="text-2xl font-extrabold text-emerald-700">{totalResidents} คน</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">จำนวนครัวเรือน</span>
                <span className="text-2xl font-extrabold text-blue-700">{totalHouseholds} หลัง</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">เขตหมู่บ้าน</span>
                <span className="text-2xl font-extrabold text-purple-700">{villages.length} หมู่</span>
              </div>
            </div>

            {/* Village Breakdown Table */}
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
                1. สรุปข้อมูลรายหมู่บ้าน (ขอบเขตพื้นที่ & ผู้ใหญ่บ้าน)
              </h2>
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300 text-[11px]">
                    <th className="p-2 border border-slate-300 text-center">หมู่ที่</th>
                    <th className="p-2 border border-slate-300 text-left">ชื่อหมู่บ้าน</th>
                    <th className="p-2 border border-slate-300 text-left">ผู้ใหญ่บ้าน</th>
                    <th className="p-2 border border-slate-300 text-center">เบอร์โทรศัพท์</th>
                    <th className="p-2 border border-slate-300 text-center">ประชากร</th>
                    <th className="p-2 border border-slate-300 text-center">ครัวเรือน</th>
                  </tr>
                </thead>
                <tbody>
                  {villages.map(v => {
                    const vRes = residents.filter(r => r.moo === v.mooNumber);
                    const vHouses = new Set(vRes.map(r => r.houseNo)).size;
                    return (
                      <tr key={v.id} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-300 text-center font-bold">หมู่ {v.mooNumber}</td>
                        <td className="p-2 border border-slate-300 font-semibold">{v.name}</td>
                        <td className="p-2 border border-slate-300">{v.headman}</td>
                        <td className="p-2 border border-slate-300 text-center font-mono">{v.headmanPhone}</td>
                        <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800">{vRes.length} คน</td>
                        <td className="p-2 border border-slate-300 text-center font-semibold">{vHouses} หลัง</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {exportMode === 'full' && (
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-l-4 border-emerald-600 pl-2">
                  2. บัญชีรายชื่อราษฎรและบ้านเลขที่
                </h2>
                <table className="w-full text-[11px] border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                      <th className="p-1.5 border border-slate-300 text-center">บ้านเลขที่</th>
                      <th className="p-1.5 border border-slate-300 text-center">หมู่ที่</th>
                      <th className="p-1.5 border border-slate-300 text-left">ชื่อ - นามสกุล</th>
                      <th className="p-1.5 border border-slate-300 text-center">เพศ/อายุ</th>
                      <th className="p-1.5 border border-slate-300 text-left">อาชีพ</th>
                      <th className="p-1.5 border border-slate-300 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residents.map(r => (
                      <tr key={r.id} className="border-b border-slate-200">
                        <td className="p-1.5 border border-slate-300 text-center font-bold">{r.houseNo}</td>
                        <td className="p-1.5 border border-slate-300 text-center">หมู่ {r.moo}</td>
                        <td className="p-1.5 border border-slate-300 font-medium">{r.prefix} {r.firstName} {r.lastName}</td>
                        <td className="p-1.5 border border-slate-300 text-center">{r.gender} ({r.age} ปี)</td>
                        <td className="p-1.5 border border-slate-300">{r.occupation || '-'}</td>
                        <td className="p-1.5 border border-slate-300 text-center font-semibold">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Verification Signatures Block */}
            <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
              <div>
                <p className="mb-12">ลงชื่อ..............................................................</p>
                <p className="font-bold">( {currentUser?.name || 'นายสมชาย ใจดี'} )</p>
                <p className="text-[11px] text-slate-500">เจ้าหน้าที่รับรองข้อมูลทะเบียนราษฎร</p>
              </div>

              <div>
                <p className="mb-12">ลงชื่อ..............................................................</p>
                <p className="font-bold">( นายวิชัย รุ่งเรือง )</p>
                <p className="text-[11px] text-slate-500">กำนัน / ประธานคณะกรรมการหมู่บ้าน</p>
              </div>
            </div>

            {/* Document Footer */}
            <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
              <span>ระบบสารสนเทศจัดการข้อมูลประชากรและขอบเขตพื้นที่หมู่บ้าน (Village Boundary Management)</span>
              <span>หน้า 1 จาก 1</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
