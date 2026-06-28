/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DonationItem, RequestItem, CategoryType, ItemCondition, User } from '../types';
import { CATEGORIES, PICKUP_POINTS, getCategoryPlaceholder } from '../mockData';
import MapSelector from './MapSelector';
import { 
  PlusCircle, 
  HelpCircle, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Check, 
  CheckCircle, 
  ExternalLink, 
  BookOpen, 
  User as UserIcon, 
  Tag, 
  Trash2,
  Bookmark,
  Share2
} from 'lucide-react';

interface DonorViewProps {
  donations: DonationItem[];
  requests: RequestItem[];
  currentUser: User;
  onAddDonation: (item: Omit<DonationItem, 'id' | 'donorId' | 'donorName' | 'donorContact' | 'createdAt' | 'status' | 'receiverId' | 'receiverName' | 'receiverContact' | 'reservedAt' | 'donorConfirmed' | 'receiverConfirmed'>) => void;
  onDeleteDonation: (id: string) => void;
  onMarkAsDelivered: (id: string) => void;
  onFulfillRequest: (requestId: string) => void;
  onOpenConfirmModal: (item: DonationItem) => void;
}

export default function DonorView({
  donations,
  requests,
  currentUser,
  onAddDonation,
  onDeleteDonation,
  onMarkAsDelivered,
  onFulfillRequest,
  onOpenConfirmModal
}: DonorViewProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('textbook');
  const [condition, setCondition] = useState<ItemCondition>('good');
  const [image, setImage] = useState('');
  const [pickupPoint, setPickupPoint] = useState(PICKUP_POINTS[0].name);
  const [usePresetImage, setUsePresetImage] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_posts' | 'requests'>('my_posts');

  // Handle local image file upload (convert to Base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setUsePresetImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const finalImage = usePresetImage ? getCategoryPlaceholder(category) : image;

    onAddDonation({
      title,
      description,
      category,
      condition,
      image: finalImage,
      pickupPoint
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory('textbook');
    setCondition('good');
    setImage('');
    setPickupPoint(PICKUP_POINTS[0].name);
    setUsePresetImage(true);
    setShowAddForm(false);
  };

  // Filter donations created by the active user
  const myDonations = donations.filter(item => item.donorId === currentUser.id);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner Intro */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-800/30">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            ระบบปันสุขสาขา รปศ.
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-sans leading-tight">
            แบ่งปันสิ่งของ รอยยิ้ม และจิตสาธารณะภายในสาขา รปศ.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            มาร่วมส่งต่อตำราเรียน ชุดนิสิต อุปกรณ์การเรียน หรือชีทสรุปเพื่อช่วยลดค่าใช้จ่ายให้น้องๆ ร่วมสร้างสังคมแห่งการแบ่งปันในรั้วมหาวิทยาลัยด้วยมือคุณกันครับ
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              id="btn-trigger-add-donation"
            >
              <PlusCircle className="w-4 h-4" />
              ลงทะเบียนสิ่งของบริจาคใหม่
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,var(--color-amber-500),transparent_70%)] pointer-events-none"></div>
      </div>

      {/* FORM TO POST DONATION */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-xl animate-scale-up">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-lg text-slate-800 font-sans flex items-center gap-2">
                🎁 กรอกรายละเอียดสิ่งของบริจาค
              </h3>
              <p className="text-xs text-slate-400">กรุณาระบุข้อมูลตามจริง เพื่อประโยชน์สูงสุดต่อเพื่อนๆ ผู้รับบริจาค</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all"
            >
              ยกเลิก
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Input text details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="don-title" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    ชื่อสิ่งของบริจาค <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="don-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น หนังสือ รัฐศาสตร์ทั่วไป / เข็มกลัดสาขา รปศ."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="don-desc" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    อธิบายรายละเอียดและข้อมูลติดต่อเพิ่มเติม <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="don-desc"
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="เช่น สภาพสิ่งของ มีจุดชำรุดตรงไหนหรือไม่ หรือช่องทางการนัดติดต่อเพิ่มเติม"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="don-category" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      หมวดหมู่สิ่งของ
                    </label>
                    <select
                      id="don-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryType)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-semibold"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="don-condition" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      สภาพของปันสุข
                    </label>
                    <select
                      id="don-condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as ItemCondition)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-xl p-3 text-xs text-slate-800 outline-none transition-all font-semibold"
                    >
                      <option value="new">🆕 ใหม่เอี่ยม (ยังไม่เคยใช้งาน)</option>
                      <option value="like_new">💎 สภาพดีมาก (ใกล้เคียงมือหนึ่ง)</option>
                      <option value="good">👍 สภาพดี (ใช้งานได้ปกติ มีรอยบ้าง)</option>
                      <option value="fair">👌 สภาพพอใช้ (ผ่านการใช้งานพอสมควร)</option>
                    </select>
                  </div>
                </div>

                {/* Drop point specification */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    จุดวางของที่ต้องการนัดพิกัด <span className="text-rose-500">*</span>
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs font-semibold text-slate-700">
                    📍 {pickupPoint || 'กรุณาเลือกในแผนที่ด้านขวา'}
                  </div>
                </div>
              </div>

              {/* Right Column: Image and Drop Point Map */}
              <div className="space-y-5">
                
                {/* Image Selection Block */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    รูปประกอบสิ่งของ
                  </label>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex gap-4 items-center">
                      <button
                        type="button"
                        onClick={() => setUsePresetImage(true)}
                        className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          usePresetImage 
                            ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        🎨 ใช้รูปสัญลักษณ์หมวดหมู่
                      </button>
                      <button
                        type="button"
                        onClick={() => setUsePresetImage(false)}
                        className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                          !usePresetImage 
                            ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        📸 อัปโหลดรูปจริง
                      </button>
                    </div>

                    {usePresetImage ? (
                      <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100">
                        <img 
                          src={getCategoryPlaceholder(category)} 
                          alt="Preset Category Placeholder" 
                          className="w-16 h-16 object-cover rounded-lg border shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-700">รูปภาพสัญลักษณ์ระบบอัตโนมัติ</p>
                          <p className="text-[10px] text-slate-400">ระบบจะดึงภาพสต็อกที่เป็นตัวแทนของกลุ่ม {CATEGORIES.find(c => c.id === category)?.name} โดยอัตโนมัติ</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-2 pb-2 text-center px-4">
                              <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                              <p className="text-[11px] font-bold text-slate-600">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่</p>
                              <p className="text-[9px] text-slate-400">PNG, JPG, JPEG (รองรับขนาดภาพสัดส่วน 1:1)</p>
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                        {image && (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100">
                            <img src={image} alt="Uploaded preview" className="w-12 h-12 object-cover rounded-lg border shrink-0" referrerPolicy="no-referrer" />
                            <span className="text-[10px] text-emerald-600 font-bold">✓ อัปโหลดสำเร็จ</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Selector inside form */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    เลือกพิกัดบนแผนที่จำลอง
                  </label>
                  <MapSelector 
                    selectedPointId={pickupPoint} 
                    onSelectPoint={(pointName) => setPickupPoint(pointName)} 
                  />
                </div>

              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                id="btn-submit-donation"
              >
                <CheckCircle className="w-4 h-4" />
                ยืนยันลงโพสต์บริจาค
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW SELECTOR TABS */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('my_posts')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'my_posts'
              ? 'border-amber-500 text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-my-posts"
        >
          🎁 รายการสิ่งของที่คุณลงบริจาค ({myDonations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-amber-500 text-slate-800'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="tab-receiver-requests"
        >
          🙋‍♂️ รายการความต้องการที่ผู้รับลงประกาศ ({requests.filter(r => r.status === 'active').length})
        </button>
      </div>

      {/* CONTENT FOR TAB: MY POSTS */}
      {activeTab === 'my_posts' && (
        <div>
          {myDonations.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-700 text-base">คุณยังไม่มีรายการลงบริจาคในระบบ</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                คลิกที่ปุ่ม "ลงทะเบียนสิ่งของบริจาคใหม่" ด้านบน เพื่อแบ่งปันอุปกรณ์การเรียน สมุดจด หรือเสื้อนักศึกษาที่ไม่ได้ใช้แล้วให้แก่เพื่อนๆ สาขารัฐประศาสนศาสตร์กันเถอะ!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDonations.map((item) => {
                
                const catInfo = CATEGORIES.find(c => c.id === item.category);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image Block with Badge Overlay */}
                      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${catInfo?.bgClass}`}>
                            {catInfo?.name}
                          </span>
                        </div>
                        {/* Condition Badge */}
                        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white border border-slate-700 font-medium uppercase tracking-wide">
                          {item.condition === 'new' ? '🆕 ใหม่แกะกล่อง' : item.condition === 'like_new' ? '💎 สภาพดีเลิศ' : item.condition === 'good' ? '👍 สภาพดี' : '👌 สภาพพอใช้'}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-4 space-y-3.5">
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-sm text-slate-800 line-clamp-1 hover:text-amber-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 h-8 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Status label banner */}
                        <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center text-[10px] font-semibold">
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.pickupPoint}
                          </span>
                          
                          {item.status === 'available' && (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              🟢 พร้อมปันสุข
                            </span>
                          )}
                          {item.status === 'reserved' && (
                            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
                              ⏱️ รอคู่ยืนยันสิทธิ์
                            </span>
                          )}
                          {item.status === 'confirmed' && (
                            <span className="text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                              🤝 จับคู่แล้ว / รอส่งมอบ
                            </span>
                          )}
                          {item.status === 'delivered' && (
                            <span className="text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                              📍 ส่ง ณ จุดรับแล้ว
                            </span>
                          )}
                          {item.status === 'completed' && (
                            <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                              ✓ บริจาคเสร็จสิ้น
                            </span>
                          )}
                        </div>

                        {/* Receiver reservation details if any */}
                        {item.receiverName && (
                          <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl text-[10px] space-y-1">
                            <p className="text-slate-500 flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-indigo-500" />
                              <span>ผู้รับบริจาค: <strong className="text-slate-700">{item.receiverName}</strong></span>
                            </p>
                            <p className="text-slate-400 pl-4 truncate">ติดต่อ: {item.receiverContact}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS FOR INDIVIDUAL CARD */}
                    <div className="px-4 pb-4 pt-1 border-t border-slate-50 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onDeleteDonation(item.id)}
                        className="p-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                        title="ลบโพสต์บริจาคนี้"
                        id={`btn-delete-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {item.status === 'available' && (
                        <div className="flex-1 text-center bg-slate-50 border border-slate-200 text-slate-500 text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> รอคนกดสนใจ...
                        </div>
                      )}

                      {item.status === 'reserved' && (
                        <button
                          type="button"
                          onClick={() => onOpenConfirmModal(item)}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] py-1.5 px-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
                          id={`btn-open-confirm-${item.id}`}
                        >
                          <Clock className="w-3.5 h-3.5" /> จัดการสิทธิ์ยืนยัน
                        </button>
                      )}

                      {item.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => onMarkAsDelivered(item.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
                          id={`btn-mark-delivered-${item.id}`}
                        >
                          <Check className="w-3.5 h-3.5" /> ฉันไปวางของเสร็จสิ้น
                        </button>
                      )}

                      {item.status === 'delivered' && (
                        <div className="flex-1 text-center bg-sky-50 border border-sky-100 text-sky-700 text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 font-bold">
                          ⏱️ รอผู้รับหยิบของและกดยืนยัน
                        </div>
                      )}

                      {item.status === 'completed' && (
                        <div className="flex-1 text-center bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 font-bold">
                          🎉 สำเร็จเรียบร้อย!
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

      {/* CONTENT FOR TAB: RECEIVER REQUESTS */}
      {activeTab === 'requests' && (
        <div>
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 mb-6 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-normal">
              <p className="font-bold">💡 โหมดจับคู่ตรงสำหรับผู้บริจาค (Direct Matching Offer)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                รายการเหล่านี้มาจากผู้รับบริจาคที่ต้องการของด่วน คุณสามารถคลิกปุ่ม "ปันสุขสิ่งของชิ้นนี้ให้เลย!" เพื่อเปิดการยืนยันส่งมอบของชิ้นนั้นให้ผู้รับโดยตรงทันที
              </p>
            </div>
          </div>

          {requests.filter(r => r.status === 'active').length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center max-w-xl mx-auto space-y-3">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-700 text-base">ไม่มีประกาศตามหาของค้างอยู่</h4>
              <p className="text-xs text-slate-400">
                ยอดเยี่ยมมาก! ดูเหมือนนักศึกษาและสมาพันธ์ในสโมสร รปศ. จะได้รับสิ่งปันสุขกันครบถ้วนแล้ว
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.filter(r => r.status === 'active').map((req) => {
                const catInfo = CATEGORIES.find(c => c.id === req.category);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top bar details */}
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo?.bgClass}`}>
                          {catInfo?.name}
                        </span>
                        
                        {req.urgency === 'high' && (
                          <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full uppercase border border-rose-200 tracking-wider flex items-center gap-1 animate-pulse">
                            ⚠️ ต้องการด่วนมาก
                          </span>
                        )}
                        {req.urgency === 'medium' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            ⚡ ปานกลาง
                          </span>
                        )}
                        {req.urgency === 'low' && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                            ⚙️ ไม่รีบร้อน
                          </span>
                        )}
                      </div>

                      {/* Request titles */}
                      <div className="space-y-1 text-left">
                        <h4 className="font-bold text-xs md:text-sm text-slate-800 leading-snug">
                          {req.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {req.description}
                        </p>
                      </div>

                      {/* Requester details */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-left text-[10px] space-y-1">
                        <p className="font-bold text-slate-700 flex items-center gap-1">
                          <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                          ประกาศโดย: {req.receiverName}
                        </p>
                        <p className="text-slate-400 pl-4">ข้อมูลติดต่อ: {req.receiverContact}</p>
                      </div>
                    </div>

                    {/* Offer donation actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onFulfillRequest(req.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1"
                        id={`btn-fulfill-${req.id}`}
                      >
                        <Share2 className="w-4 h-4" /> ปันสุขสิ่งของชิ้นนี้ให้เลย!
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
