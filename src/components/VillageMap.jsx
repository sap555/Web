import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Layers, Edit3, Trash2, CheckCircle2, RefreshCw, 
  HelpCircle, Home, Users, Info, Shield, PlusCircle 
} from 'lucide-react';

// Custom Marker Icons for Leaflet
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 2 0 0 1-2 2H5a2 2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Component for capturing user clicks to draw polygons
function MapDrawEvents({ isDrawing, drawnPoints, setDrawnPoints }) {
  useMapEvents({
    click(e) {
      if (isDrawing) {
        const { lat, lng } = e.latlng;
        setDrawnPoints(prev => [...prev, [lat, lng]]);
      }
    }
  });
  return null;
}

export default function VillageMap({ 
  villages, 
  residents, 
  onSaveVillageBoundary,
  onOpenExportPdf
}) {
  const [mapTile, setMapTile] = useState('osm'); // osm | satellite | topo
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'moo-1');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState([]);
  const [showHouseMarkers, setShowHouseMarkers] = useState(true);

  // Selected village object
  const selectedVillage = villages.find(v => v.id === selectedVillageId) || villages[0];

  // Tile layers definition
  const tileUrls = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
    }
  };

  const startDrawingMode = () => {
    setIsDrawing(true);
    setDrawnPoints([]);
  };

  const handleClearPoints = () => {
    setDrawnPoints([]);
  };

  const handleSaveBoundary = () => {
    if (drawnPoints.length < 3) {
      alert('กรุณาคลิกบนแผนที่อย่างน้อย 3 จุด เพื่อสร้างรูปหลายเหลี่ยม (Polygon)');
      return;
    }

    onSaveVillageBoundary(selectedVillage.id, drawnPoints);
    setIsDrawing(false);
    setDrawnPoints([]);
    alert(`บันทึกเส้นขอบเขตใหม่สำหรับ ${selectedVillage.name} (หมู่ที่ ${selectedVillage.mooNumber}) เรียบร้อยแล้ว!`);
  };

  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setDrawnPoints([]);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in pb-2">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-0.5">
            <MapPin className="w-4 h-4" />
            <span>GIS Village Boundary Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">แผนที่ขอบเขตพื้นที่หมู่บ้าน & ตำแหน่งบ้านพัก</h2>
          <p className="text-slate-500 text-xs mt-0.5">
            วาดเส้นกำหนดขอบเขตหมู่บ้าน (Polygon Boundary Drawer) และแสดงพิกัดบ้านเรือน
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenExportPdf}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md transition"
          >
            <span>ส่งออกแผนที่ & เอกสาร PDF</span>
          </button>
        </div>
      </div>

      {/* Control Tools Panel */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center shrink-0">
        
        {/* Layer Selector */}
        <div className="lg:col-span-4 flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 flex items-center shrink-0">
            <Layers className="w-4 h-4 mr-1 text-slate-500" /> รูปแบบแผนที่:
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMapTile('osm')}
              className={`px-3 py-1 rounded-lg transition ${mapTile === 'osm' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              ถนน (OSM)
            </button>
            <button
              onClick={() => setMapTile('satellite')}
              className={`px-3 py-1 rounded-lg transition ${mapTile === 'satellite' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              ดาวเทียม
            </button>
            <button
              onClick={() => setMapTile('topo')}
              className={`px-3 py-1 rounded-lg transition ${mapTile === 'topo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              ภูมิประเทศ
            </button>
          </div>
        </div>

        {/* Village Selection */}
        <div className="lg:col-span-4 flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600 shrink-0">เลือกหมู่บ้าน:</span>
          <select
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                หมู่ที่ {v.mooNumber} - {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Drawing Controls */}
        <div className="lg:col-span-4 flex items-center justify-end space-x-2">
          <label className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 mr-2 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={showHouseMarkers}
              onChange={(e) => setShowHouseMarkers(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>แสดงหมุดบ้านเรือน</span>
          </label>

          {!isDrawing ? (
            <button
              onClick={startDrawingMode}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>วาดขอบเขตใหม่</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleSaveBoundary}
                className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>บันทึก ({drawnPoints.length} จุด)</span>
              </button>
              <button
                onClick={handleClearPoints}
                className="p-1.5 text-slate-500 hover:text-amber-600 bg-slate-100 rounded-lg"
                title="ล้างจุดที่วาด"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelDrawing}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg"
                title="ยกเลิก"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Drawing Mode Instruction Banner */}
      {isDrawing && (
        <div className="p-2.5 bg-emerald-900 text-emerald-100 rounded-xl text-xs flex items-center justify-between shadow-inner animate-pulse shrink-0">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>โหมดวาดขอบเขตสำหรับ {selectedVillage.name}:</strong> คลิกบนพื้นที่แผนที่เพื่อกำหนดจุดพิกัดแต่ละจุด (อย่างน้อย 3 จุด)
            </span>
          </div>
          <span className="bg-emerald-800 px-2 py-0.5 rounded font-mono text-[11px]">
            จุดปัจจุบัน: {drawnPoints.length} จุด
          </span>
        </div>
      )}

      {/* Main Map Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2 overflow-hidden flex-1 min-h-[420px] relative">
        <MapContainer
          center={[14.532, 100.925]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: '12px' }}
        >
          <TileLayer
            attribution={tileUrls[mapTile].attribution}
            url={tileUrls[mapTile].url}
          />

          {/* Event Listener for custom drawing */}
          <MapDrawEvents 
            isDrawing={isDrawing} 
            drawnPoints={drawnPoints} 
            setDrawnPoints={setDrawnPoints} 
          />

          {/* Render Existing Village Polygons */}
          {villages.map((v) => {
            const isCurrentSelected = v.id === selectedVillage.id;
            const villageResidents = residents.filter(r => r.moo === v.mooNumber);

            return (
              <Polygon
                key={v.id}
                positions={v.boundary}
                pathOptions={{
                  color: v.color,
                  fillColor: v.color,
                  fillOpacity: isCurrentSelected ? 0.35 : 0.15,
                  weight: isCurrentSelected ? 3 : 1.5,
                  dashArray: isCurrentSelected ? undefined : '4, 4'
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-extrabold text-slate-900 text-sm">
                        หมู่ที่ {v.mooNumber} - {v.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>ผู้ใหญ่บ้าน:</strong> {v.headman}
                    </p>
                    <p className="text-xs text-slate-600">
                      <strong>เบอร์โทร:</strong> {v.headmanPhone}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-1.5 rounded-lg border">
                      <span>จำนวนประชากร:</span>
                      <strong className="text-emerald-700 font-bold">{villageResidents.length} คน</strong>
                    </div>
                  </div>
                </Popup>
                <Tooltip sticky>
                  <span className="font-bold text-xs">หมู่ที่ {v.mooNumber} ({v.name})</span>
                </Tooltip>
              </Polygon>
            );
          })}

          {/* Render Polygon currently being drawn */}
          {isDrawing && drawnPoints.length > 0 && (
            <Polygon
              positions={drawnPoints}
              pathOptions={{
                color: '#EF4444',
                fillColor: '#EF4444',
                fillOpacity: 0.4,
                weight: 2,
                dashArray: '6, 6'
              }}
            />
          )}

          {/* Render House Markers */}
          {showHouseMarkers && residents.map((res) => {
            if (!res.lat || !res.lng) return null;
            const villageObj = villages.find(v => v.mooNumber === res.moo);
            const iconColor = villageObj ? villageObj.color : '#10B981';

            return (
              <Marker
                key={res.id}
                position={[res.lat, res.lng]}
                icon={createCustomIcon(iconColor)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 space-y-1 min-w-[180px]">
                    <div className="flex items-center space-x-1 font-bold text-slate-900 text-xs">
                      <Home className="w-3.5 h-3.5 text-emerald-600" />
                      <span>บ้านเลขที่ {res.houseNo} (หมู่ {res.moo})</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {res.prefix} {res.firstName} {res.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      สถานะ: <span className="text-emerald-700 font-medium">{res.status}</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      อาชีพ: {res.occupation || '-'}
                    </p>
                    {res.phone && (
                      <p className="text-[11px] text-slate-500">
                        โทร: {res.phone}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-md border border-slate-200 text-xs space-y-1.5">
          <p className="font-bold text-slate-800 border-b pb-1">สัญลักษณ์สีขอบเขตหมู่บ้าน</p>
          {villages.map(v => (
            <div key={v.id} className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: v.color }} />
              <span className="text-slate-700 font-medium">หมู่ {v.mooNumber} ({v.name})</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
