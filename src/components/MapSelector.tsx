/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PICKUP_POINTS } from '../mockData';
import { PickupPoint } from '../types';
import { MapPin, Info, Home } from 'lucide-react';

interface MapSelectorProps {
  selectedPointId?: string;
  onSelectPoint?: (pointName: string) => void;
  interactive?: boolean;
}

export default function MapSelector({ selectedPointId, onSelectPoint, interactive = true }: MapSelectorProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PickupPoint | null>(null);
  
  const handlePointClick = (point: PickupPoint) => {
    if (!interactive) return;
    if (onSelectPoint) {
      onSelectPoint(point.name);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h4 className="font-sans font-semibold text-lg text-amber-400 flex items-center gap-2">
            <MapPin className="w-5 h-5 animate-pulse" />
            แผนที่จุดรับ-ส่งสิ่งของปันสุข (PA Safety Drop Points)
          </h4>
          <p className="text-xs text-slate-400">
            พิกัดวางของ ณ คณะมนุษยศาสตร์และสังคมศาสตร์ เพื่อความปลอดภัย สะดวก และไม่รบกวนการเรียนการสอน
          </p>
        </div>
        <div className="flex gap-2 text-xs bg-slate-800/80 p-2 rounded-lg border border-slate-700">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
          <span className="text-slate-300 font-medium">จุดว่างพร้อมใช้งาน</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Map */}
        <div className="lg:col-span-2 relative bg-slate-950/80 rounded-xl p-4 border border-slate-800 h-[260px] flex items-center justify-center">
          {/* Abstract Campus Layout background */}
          <div className="absolute inset-0 opacity-10 flex flex-col justify-around p-8 select-none pointer-events-none">
            <div className="border border-dashed border-slate-500 h-1/4 rounded flex items-center justify-center text-[10px] font-mono">FACULTY OFFICE</div>
            <div className="flex gap-4 h-1/3">
              <div className="border border-dashed border-slate-500 w-1/2 rounded flex items-center justify-center text-[10px] font-mono">LECTURE HALL 1 & 2</div>
              <div className="border border-dashed border-slate-500 w-1/2 rounded flex items-center justify-center text-[10px] font-mono">PA CLUBROOM (ชั้น 2)</div>
            </div>
            <div className="border border-dashed border-slate-500 h-1/5 rounded flex items-center justify-center text-[10px] font-mono">COMMON GROUND / MARBLE TABLE</div>
          </div>

          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <Home className="w-3 h-3" />
            ตึกบูรณาการมนุษยศาสตร์ฯ (Faculty of Humanities)
          </div>

          {/* Render Points */}
          <div className="relative w-full h-full max-w-[400px] max-h-[220px]">
            {PICKUP_POINTS.map((point) => {
              const isSelected = selectedPointId ? (point.name === selectedPointId) : false;
              const isHovered = hoveredPoint?.id === point.id;
              
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => handlePointClick(point)}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 z-10 ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-400/50 scale-125' 
                      : isHovered 
                        ? 'bg-emerald-400 text-slate-950 scale-110 shadow-lg' 
                        : 'bg-emerald-600/90 text-white hover:bg-emerald-400 hover:text-slate-950 hover:scale-110'
                  }`}
                  id={`map-pin-${point.id}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="absolute left-1/2 top-full -translate-x-1/2 mt-1 bg-slate-900 text-slate-100 text-[10px] py-0.5 px-1.5 rounded border border-slate-700 whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                    {point.floor}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mini overlay details */}
          {hoveredPoint && (
            <div className="absolute bottom-3 right-3 left-3 bg-slate-900/95 border border-slate-700 rounded-lg p-2 flex items-start gap-2 text-xs text-slate-200 shadow-xl transition-all duration-200">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-100">{hoveredPoint.name} ({hoveredPoint.floor})</p>
                <p className="text-[11px] text-slate-400">{hoveredPoint.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Textual list of drop points */}
        <div className="flex flex-col justify-between">
          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {PICKUP_POINTS.map((point) => {
              const isSelected = selectedPointId ? (point.name === selectedPointId) : false;
              return (
                <div
                  key={point.id}
                  onClick={() => handlePointClick(point)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    interactive ? 'cursor-pointer' : ''
                  } ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200' 
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-xs text-slate-200 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                      {point.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      {point.floor}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{point.description}</p>
                </div>
              );
            })}
          </div>

          {interactive && onSelectPoint && (
            <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800/80 text-center mt-3">
              <p className="text-[10px] text-slate-400">
                {selectedPointId 
                  ? <>เลือกจุดวางของแล้ว: <strong className="text-amber-400">{selectedPointId}</strong></>
                  : '💡 คลิกที่หมุดบนแผนที่หรือรายชื่อด้านบนเพื่อเลือกจุดนัดพบ/วางของ'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
