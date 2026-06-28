/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Notification } from '../types';
import { MOCK_USERS } from '../mockData';
import { 
  Users, 
  Bell, 
  RefreshCw, 
  Leaf, 
  Award, 
  HelpCircle,
  GraduationCap,
  MessageSquareCode
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'donor' | 'receiver';
  onRoleChange: (role: 'donor' | 'receiver') => void;
  currentUser: User;
  onUserChange: (user: User) => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
  totalCompletedDonations: number;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  currentUser,
  onUserChange,
  notifications,
  onMarkNotificationAsRead,
  onClearNotifications,
  totalCompletedDonations
}: NavbarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-150 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center border border-amber-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-xl tracking-tight text-slate-800">PA SHARE</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  รัฐประศาสนศาสตร์ ปันสุข
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                คณะมนุษยศาสตร์และสังคมศาสตร์ | มหาวิทยาลัยเพื่อสังคม
              </p>
            </div>
          </div>

          {/* Social Impact Stats (Mini Center Widget) */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-slate-700">
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <Award className="w-4 h-4 text-amber-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">แบ่งปันรวม</p>
                <p className="text-xs font-bold text-slate-800">{32 + totalCompletedDonations} ครั้ง</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ลดคาร์บอนฟุตพริ้นท์</p>
                <p className="text-xs font-bold text-slate-800">{(32 + totalCompletedDonations) * 2.5} kg CO₂</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            
            {/* ROLE SWITCHER - Super prominent and beautifully styled */}
            <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200/60 shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('receiver')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === 'receiver'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="btn-role-receiver"
              >
                🙋‍♂️ ผู้รับบริจาค
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('donor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === 'donor'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="btn-role-donor"
              >
                🎁 ผู้บริจาค
              </button>
            </div>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotificationDropdown(!showNotificationDropdown);
                  setShowUserDropdown(false);
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  unreadCount > 0 
                    ? 'border-amber-200 bg-amber-50 text-amber-700 animate-pulse-subtle' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                id="btn-notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                    <span className="font-semibold text-xs text-slate-800">แจ้งเตือนระบบล่าสุด ({unreadCount})</span>
                    {notifications.length > 0 && (
                      <button 
                        onClick={onClearNotifications}
                        className="text-[10px] font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        ล้างทั้งหมด
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        ไม่มีข้อความแจ้งเตือนใหม่ในขณะนี้
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => onMarkNotificationAsRead(notif.id)}
                          className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              notif.type === 'success' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : notif.type === 'warning' 
                                  ? 'bg-rose-100 text-rose-800' 
                                  : notif.type === 'timer' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {notif.type === 'timer' ? '⏱️ จับเวลา' : notif.type === 'success' ? 'สำเร็จ' : 'ระบบ'}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(notif.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mb-0.5">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 leading-normal">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated User Selector (Enables testing multi-user flows easily) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotificationDropdown(false);
                }}
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 bg-slate-50/50 hover:bg-slate-50 text-slate-700 transition-all text-left"
                id="btn-user-selector"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div className="hidden md:block">
                  <p className="text-[11px] text-slate-400 font-medium">จำลองบัญชีผู้ใช้</p>
                  <p className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">{currentUser.name}</p>
                </div>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden md:block" />
              </button>

              {/* User Dropdown Selection List */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เลือกบัญชีนักศึกษาจำลอง</p>
                    <p className="text-xs text-slate-500">เพื่อทดสอบการตอบโต้ยืนยันข้ามบุคคล</p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {MOCK_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onUserChange(user);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left p-3 hover:bg-amber-50/50 transition-colors flex items-start gap-2.5 ${
                          currentUser.id === user.id ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          currentUser.id === user.id ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">รหัส: {user.studentId}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
