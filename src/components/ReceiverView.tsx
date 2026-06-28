/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DonationItem, RequestItem, CategoryType, UrgencyLevel, User } from '../types';
import { CATEGORIES, PICKUP_POINTS, getCategoryPlaceholder } from '../mockData';
import { 
  Search, 
  Filter, 
  HelpCircle, 
  PlusCircle, 
  MapPin, 
  User as UserIcon, 
  Clock, 
  Check, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Trash2,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface ReceiverViewProps {
  donations: DonationItem[];
  requests: RequestItem[];
  currentUser: User;
  onInterestClick: (itemId: string) => void;
  onReceiveItem: (itemId: string) => void;
  onAddRequest: (item: Omit<RequestItem, 'id' | 'receiverId' | 'receiverName' | 'receiverContact' | 'createdAt' | 'status'>) => void;
  onDeleteRequest: (id: string) => void;
  onOpenConfirmModal: (item: DonationItem) => void;
}

export default function ReceiverView({
  donations,
  requests,
  currentUser,
  onInterestClick,
  onReceiveItem,
  onAddRequest,
  onDeleteRequest,
  onOpenConfirmModal
}: ReceiverViewProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');

  // Request Form State
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqCategory, setReqCategory] = useState<CategoryType>('textbook');
  const [reqUrgency, setReqUrgency] = useState<UrgencyLevel>('medium');

  const [activeTab, setActiveTab] = useState<'browse' | 'my_requests'>('browse');

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqDescription.trim()) return;

    onAddRequest({
      title: reqTitle,
      description: reqDescription,
      category: reqCategory,
      urgency: reqUrgency
    });

    setReqTitle('');
    setReqDescription('');
    setReqCategory('textbook');
    setReqUrgency('medium');
    setShowRequestForm(false);
  };

  // Filter available donations
  const filteredDonations = donations.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const myRequests = requests.filter(req => req.receiverId === currentUser.id);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner Intro */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
            มุมส่งสุขเพื่อนักศึกษา รปศ.
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-sans leading-tight">
            รับมอบหนังสือ อุปกรณ์การเรียน และสิ่งของแบ่งปันจากใจรุ่นพี่
          </h2>
          <p className="text-sm text-amber-50/90 leading-relaxed">
            ค้นหาตำราวิชาการ เข็มขัด/เข็มกลัดประจำสาขา ชีทโน้ตสรุปสอบต่างๆ ที่รุ่นพี่เตรียมไว้ให้ หรือลงประกาศขอรับสิ่งของที่คุณกำลังตามหาอยู่ได้ฟรีทันทีครับ
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveTab('browse');
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs py-3 px-5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              🔍 เรียกดูสิ่งของปันสุขทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-white/25 hover:bg-white/35 text-white font-bold text-xs py-3 px-5 rounded-xl border border-white/30 backdrop-blur-sm transition-all flex items-center gap-1.5"
              id="btn-trigger-add-request"
            >
              <PlusCircle className="w-4 h-4" /> ลงประกาศขอรับของด่วน
            </button>
          </div>
        </div>
        {/* Decorative badge illustration */}
        <div className="absolute right-6 bottom-4 text-white/15 hidden md:block select-none pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
      </div>

      {/* REQUEST FORM */}
      {showRequestForm && (
        <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-xl animate-scale-up">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-800 font-sans flex items-center gap-2">
                🙋‍♂️ กรอกรายละเอียดประกาศขอรับสิ่งของ
              </h3>
              <p className="text-xs text-slate-400">เมื่อโพสต์แล้ว ผู้บริจาคจะเห็นความต้องการของคุณและติดต่อเสนอส่งมอบให้โดยตรง</p>
            </div>
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all"
            >
              ยกเลิก
            </button>
          </div>

          <form onSubmit={handleRequestSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4 text-left">
                <div>
                  <label htmlFor="req-title" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    หัวข้อหรือของที่ต้องการด่วน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="req-title"
                    type="text"
                    required
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    placeholder="เช่น หาหนังสือวิชา การบริหารวิสาหกิจชุมชน / เสื้อช็อปสาขา รปศ."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="req-desc" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    ระบุรายละเอียด ความจำเป็น หรือช่วงวันเวลาที่ต้องการ <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="req-desc"
                    required
                    rows={4}
                    value={reqDescription}
                    onChange={(e) => setReqDescription(e.target.value)}
                    placeholder="ระบุวัตถุประสงค์เพื่ออธิบายความจำเป็น เช่น ต้องนำมาใช้อ่านสอบกลางภาคสัปดาห์หน้า"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <label htmlFor="req-category" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    จัดอยู่ในหมวดหมู่ใด
                  </label>
                  <select
                    id="req-category"
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-semibold"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="req-urgency" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    ความเร่งด่วนในการรับของ
                  </label>
                  <select
                    id="req-urgency"
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as UrgencyLevel)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-semibold"
                  >
                    <option value="high">🚨 ต้องการด่วนมาก (ใกล้ต้องใช้งานแล้ว)</option>
                    <option value="medium">⚡ ปานกลาง (ต้องการภายใน 1-2 สัปดาห์)</option>
                    <option value="low">⚙️ ทั่วไป (ต้องการเพื่อสำรองไว้ ไม่รีบใช้งาน)</option>
                  </select>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 leading-normal flex gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">นโยบายปันสุขร่วมสร้างสรรค์</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">เมื่อได้รับของแล้วโปรดแวะกลับมากดปุ่ม "ได้รับเรียบร้อย" เพื่อระบบจะได้บันทึกสถิติสิ่งแวดล้อมให้แก่สาขา รปศ. ของเราด้วยครับ</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                id="btn-submit-request"
              >
                ✓ ส่งประกาศขอรับของ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NAVIGATION TABS FOR RECEIVER */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'browse'
              ? 'border-amber-500 text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-browse-donations"
        >
          🔍 ค้นหาสิ่งของปันสุขที่มีผู้ลงบริจาค ({filteredDonations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('my_requests')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'my_requests'
              ? 'border-amber-500 text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-my-requests"
        >
          📋 ประกาศตามหาของของคุณ ({myRequests.length})
        </button>
      </div>

      {/* TAB CONTENT: BROWSE DONATIONS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Advanced Search & Filtering bar */}
          <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search input */}
            <div className="relative w-full md:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="พิมพ์ชื่อหนังสือ, เสื้อผ้า หรือชื่อสิ่งของที่ต้องการหา..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none font-medium text-slate-800 transition-all"
                id="search-input"
              />
            </div>

            {/* Category selection */}
            <div className="w-full md:w-48 flex gap-2 items-center">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-semibold text-slate-700"
                id="category-filter"
              >
                <option value="all">📁 ทุกหมวดหมู่</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Condition selection */}
            <div className="w-full md:w-40">
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-semibold text-slate-700"
                id="condition-filter"
              >
                <option value="all">💎 ทุกสภาพของ</option>
                <option value="new">🆕 ใหม่เอี่ยม</option>
                <option value="like_new">💎 ดีมาก</option>
                <option value="good">👍 ดี</option>
                <option value="fair">👌 พอใช้</option>
              </select>
            </div>

          </div>

          {/* GRID OF DONATIONS */}
          {filteredDonations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center max-w-xl mx-auto space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-base">ไม่พบสิ่งของที่คุณค้นหา</h4>
              <p className="text-xs text-slate-400">
                ลองตรวจสอบตัวสะกด หรือเคลียร์ตัวกรองหมวดหมู่และสภาพเพื่อให้ระบบแสดงผลครอบคลุมขึ้นครับ
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCondition('all');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
              >
                ล้างคำค้นหาทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((item) => {
                const catInfo = CATEGORIES.find(c => c.id === item.category);
                
                const isUserReceiverOfThis = item.receiverId === currentUser.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${catInfo?.bgClass}`}>
                            {catInfo?.name}
                          </span>
                        </div>
                        {/* Condition Tag */}
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white border border-slate-700 font-medium">
                          {item.condition === 'new' ? '🆕 ใหม่แกะกล่อง' : item.condition === 'like_new' ? '💎 สภาพเลิศ' : item.condition === 'good' ? '👍 สภาพดี' : '👌 สภาพพอใช้'}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-4 space-y-3.5 text-left">
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-sm text-slate-800 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 h-8 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Location Drop points and donors */}
                        <div className="space-y-1.5 text-[10px] border-t border-slate-50 pt-3">
                          <p className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>พิกัดส่งมอบ: <strong className="text-slate-600">{item.pickupPoint}</strong></span>
                          </p>
                          <p className="text-slate-400 flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>ผู้ส่งต่อ: <strong className="text-slate-600">{item.donorName}</strong></span>
                          </p>
                        </div>

                        {/* Special simulation notification banner if the item is reserved by other party */}
                        {item.status === 'reserved' && !isUserReceiverOfThis && (
                          <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-700 flex items-center gap-1.5 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>ไม่สามารถขอรับบริจาคได้ (มีนักศึกษาจองสิทธิ์แล้ว)</span>
                          </div>
                        )}

                        {item.status === 'reserved' && isUserReceiverOfThis && (
                          <div className="p-2 bg-amber-50 border border-amber-200/50 rounded-xl text-[10px] text-amber-800 flex items-center gap-1.5 font-bold animate-pulse-subtle">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>คุณจองแล้ว! กรุณากดยืนยันคู่บริจาคใน 30 นาที</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CARD BUTTON ACTION ACCORDING TO STATE */}
                    <div className="px-4 pb-4 pt-1 border-t border-slate-50 text-left">
                      
                      {item.status === 'available' && (
                        <button
                          type="button"
                          onClick={() => onInterestClick(item.id)}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2 px-4 rounded-xl shadow-sm hover:shadow transition-all text-center"
                          id={`btn-interest-${item.id}`}
                        >
                          🙋‍♂️ สนใจสิ่งของชิ้นนี้ (เริ่มจับเวลา 30 นาที)
                        </button>
                      )}

                      {item.status === 'reserved' && isUserReceiverOfThis && (
                        <button
                          type="button"
                          onClick={() => onOpenConfirmModal(item)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                          id={`btn-open-confirm-rx-${item.id}`}
                        >
                          ⏱️ ยืนยันสิทธิ์ของคุณ
                        </button>
                      )}

                      {item.status === 'reserved' && !isUserReceiverOfThis && (
                        <div className="w-full bg-rose-100 text-rose-800 text-center text-xs py-2 px-4 rounded-xl font-bold cursor-not-allowed">
                          🔒 ไม่สามารถขอรับบริจาคได้
                        </div>
                      )}

                      {item.status === 'confirmed' && isUserReceiverOfThis && (
                        <div className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-center text-xs py-2 px-4 rounded-xl font-bold">
                          🤝 ยืนยันเรียบร้อยแล้ว / รอผู้ส่งนำวางของ
                        </div>
                      )}

                      {item.status === 'confirmed' && !isUserReceiverOfThis && (
                        <div className="w-full bg-rose-100 text-rose-800 text-center text-xs py-2 px-4 rounded-xl font-bold cursor-not-allowed">
                          🔒 ไม่สามารถขอรับบริจาคได้ (จับคู่แล้ว)
                        </div>
                      )}

                      {item.status === 'delivered' && isUserReceiverOfThis && (
                        <button
                          type="button"
                          onClick={() => onReceiveItem(item.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 animate-bounce-subtle"
                          id={`btn-mark-received-${item.id}`}
                        >
                          <CheckCircle className="w-4 h-4" /> ฉันหยิบของไปจากจุดรับแล้ว!
                        </button>
                      )}

                      {item.status === 'delivered' && !isUserReceiverOfThis && (
                        <div className="w-full bg-rose-100 text-rose-800 text-center text-xs py-2 px-4 rounded-xl font-bold cursor-not-allowed">
                          🔒 ไม่สามารถขอรับบริจาคได้ (ส่งมอบแล้ว)
                        </div>
                      )}

                      {item.status === 'completed' && (
                        <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-center text-xs py-2 px-4 rounded-xl font-bold">
                          ✓ มอบเรียบร้อยเสร็จสมบูรณ์
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: MY REQUESTS */}
      {activeTab === 'my_requests' && (
        <div className="space-y-6">
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-base">คุณยังไม่เคยลงประกาศตามหาของ</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ขาดแคลนตำราสอบ เสื้อสัญลักษณ์สาขา รปศ. หรือปากกาสำหรับการจดเลกเชอร์หรือไม่? กดลงประกาศเพื่อบอกให้รุ่นพี่หรือเพื่อนๆ คณะทราบและแบ่งปันให้คุณได้ทันทีครับ
              </p>
              <button
                type="button"
                onClick={() => setShowRequestForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all"
              >
                📝 โพสต์ขอรับสิ่งของตอนนี้เลย
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRequests.map((req) => {
                const catInfo = CATEGORIES.find(c => c.id === req.category);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo?.bgClass}`}>
                          {catInfo?.name}
                        </span>
                        
                        {req.urgency === 'high' && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full uppercase border border-rose-200 tracking-wider">
                            ⚠️ ด่วนมาก
                          </span>
                        )}
                        {req.urgency === 'medium' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            ⚡ ปานกลาง
                          </span>
                        )}
                        {req.urgency === 'low' && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                            ⚙️ ทั่วไป
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-left">
                        <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-snug">
                          {req.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {req.description}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-left text-[10px] space-y-0.5 text-slate-400">
                        <p>รหัสนิสิตผู้รับ: {currentUser.studentId}</p>
                        <p>ประกาศเมื่อ: {new Date(req.createdAt).toLocaleDateString('th-TH')}</p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(req.id)}
                        className="w-full border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-1"
                        id={`btn-del-req-${req.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> ลบประกาศนี้
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
