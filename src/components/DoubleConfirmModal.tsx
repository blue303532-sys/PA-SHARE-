/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DonationItem, User } from '../types';
import { Check, X, Clock, HelpCircle, ArrowRight, RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

interface DoubleConfirmModalProps {
  item: DonationItem;
  currentUser: User;
  onConfirm: (itemId: string, role: 'donor' | 'receiver') => void;
  onCancelReservation: (itemId: string) => void;
  onSwitchUserToMatch: (userId: string) => void;
  onClose: () => void;
}

export default function DoubleConfirmModal({
  item,
  currentUser,
  onConfirm,
  onCancelReservation,
  onSwitchUserToMatch,
  onClose
}: DoubleConfirmModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calculate remaining time in seconds from reservedAt (30 minutes total)
  useEffect(() => {
    if (!item.reservedAt) return;
    
    const calculateTimeLeft = () => {
      const reservedTime = new Date(item.reservedAt!).getTime();
      const expirationTime = reservedTime + 30 * 60 * 1000; // +30 minutes
      const now = Date.now();
      const difference = Math.max(0, Math.floor((expirationTime - now) / 1000));
      return difference;
    };

    setTimeLeft(calculateTimeLeft());

    const intervalId = setInterval(() => {
      const secondsLeft = calculateTimeLeft();
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [item.reservedAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isUserDonor = currentUser.id === item.donorId;
  const isUserReceiver = currentUser.id === item.receiverId;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-base font-sans">ระบบจับคู่ยืนยันสิทธิ์บริจาค (30 นาที)</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main timer display */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider mb-1">เวลาคงเหลือในการยืนยันสิทธิ์</p>
            {timeLeft > 0 ? (
              <div className="font-mono text-3xl font-extrabold text-amber-600 tracking-wider">
                {timeFormatted}
              </div>
            ) : (
              <div className="text-rose-500 font-bold text-lg flex items-center gap-1.5">
                <ShieldAlert className="w-5 h-5" /> หมดเวลาจับคู่สิทธิ์แล้ว
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-2">
              หากฝ่ายใดฝ่ายหนึ่งกดยกเลิก หรือไม่กดยืนยันในเวลาที่กำหนด สิ่งของจะถูกสลายสิทธิ์และกลับไป "พร้อมบริจาค"
            </p>
          </div>

          {/* Item details mini card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0" 
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                {item.category === 'textbook' ? '📖 ตำราเรียน' : item.category === 'uniform' ? '👔 เครื่องแต่งกาย' : '🎁 ของใช้ทั่วไป'}
              </span>
              <h4 className="font-semibold text-xs text-slate-800 truncate mt-1">{item.title}</h4>
              <p className="text-[10px] text-slate-400">ผู้บริจาค: {item.donorName}</p>
            </div>
          </div>

          {/* Verification Status Matrix */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Donor confirmation column */}
            <div className={`p-4 rounded-xl border text-center flex flex-col justify-between h-32 ${
              item.donorConfirmed 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2">1. ฝั่งผู้บริจาค</p>
                <p className="text-xs font-bold truncate">{item.donorName}</p>
              </div>
              <div className="flex justify-center mt-2">
                {item.donorConfirmed ? (
                  <div className="bg-emerald-500 text-white p-1 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" /> รอการยืนยัน
                  </span>
                )}
              </div>
            </div>

            {/* Receiver confirmation column */}
            <div className={`p-4 rounded-xl border text-center flex flex-col justify-between h-32 ${
              item.receiverConfirmed 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2">2. ฝั่งผู้รับบริจาค</p>
                <p className="text-xs font-bold truncate">{item.receiverName}</p>
              </div>
              <div className="flex justify-center mt-2">
                {item.receiverConfirmed ? (
                  <div className="bg-emerald-500 text-white p-1 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin" /> รอการยืนยัน
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Interactive instruction guidelines for students */}
          <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 leading-normal">
              <p className="font-semibold">คู่มือการทดสอบระบบจำลอง (Simulation Guide)</p>
              <p className="text-slate-500 text-[11px] mt-1">
                เพื่อสัมผัสประสบการณ์ยืนยันสิทธิ์สองฝ่าย ท่านสามารถสลับบทบาทผู้ใช้ได้อย่างง่ายดาย โดยคลิกปุ่มสลับบัญชีด้านล่างเพื่อไปกดยืนยันในอีกบทบาทหนึ่งได้ทันที!
              </p>
            </div>
          </div>

          {/* Quick simulator shortcut buttons */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">สลับผู้ใช้จำลองทันที:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSwitchUserToMatch(item.donorId)}
                className={`text-xs py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isUserDonor 
                    ? 'bg-indigo-500 text-white border-indigo-500 font-bold' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                id="sim-switch-donor"
              >
                <RefreshCw className="w-3 h-3" />
                สลับเป็นผู้บริจาค ({item.donorName.split(' ')[0]})
              </button>
              <button
                type="button"
                onClick={() => onSwitchUserToMatch(item.receiverId!)}
                className={`text-xs py-1.5 px-3 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isUserReceiver 
                    ? 'bg-indigo-500 text-white border-indigo-500 font-bold' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                id="sim-switch-receiver"
              >
                <RefreshCw className="w-3 h-3" />
                สลับเป็นผู้รับ ({item.receiverName?.split(' ')[0]})
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
          
          <button
            type="button"
            onClick={() => onCancelReservation(item.id)}
            className="flex-1 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
            id="btn-cancel-reservation"
          >
            ❌ ยกเลิกจับคู่/สละสิทธิ์
          </button>

          {isUserDonor && !item.donorConfirmed && (
            <button
              type="button"
              onClick={() => onConfirm(item.id, 'donor')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
              id="btn-confirm-donor"
            >
              <CheckCircle className="w-4 h-4" /> ยืนยันให้บริจาค
            </button>
          )}

          {isUserReceiver && !item.receiverConfirmed && (
            <button
              type="button"
              onClick={() => onConfirm(item.id, 'receiver')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
              id="btn-confirm-receiver"
            >
              <CheckCircle className="w-4 h-4" /> ยืนยันขอรับของ
            </button>
          )}

          {((isUserDonor && item.donorConfirmed) || (isUserReceiver && item.receiverConfirmed)) && (
            <div className="flex-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" /> คุณกดยืนยันแล้ว
            </div>
          )}

          {!isUserDonor && !isUserReceiver && (
            <div className="flex-1 bg-slate-200 text-slate-500 text-[11px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center">
              🔒 เฉพาะคู่กรณีที่สามารถกดยืนยันได้
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
