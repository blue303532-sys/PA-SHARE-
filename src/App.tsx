/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DonationItem, RequestItem, Notification, User, CategoryType, ItemCondition, UrgencyLevel } from './types';
import { INITIAL_DONATIONS, INITIAL_REQUESTS, MOCK_USERS, getCategoryPlaceholder } from './mockData';
import Navbar from './components/Navbar';
import DonorView from './components/DonorView';
import ReceiverView from './components/ReceiverView';
import DoubleConfirmModal from './components/DoubleConfirmModal';
import { Clock, ShieldCheck, Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Initialize States from LocalStorage or Mock Data
  const [donations, setDonations] = useState<DonationItem[]>(() => {
    const saved = localStorage.getItem('pa_share_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const saved = localStorage.getItem('pa_share_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('pa_share_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'n1',
        title: 'ยินดีต้อนรับสู่ระบบ PA SHARE',
        message: 'ระบบปันสุขสาขารัฐประศาสนศาสตร์ คณะมนุษยศาสตร์และสังคมศาสตร์ เริ่มใช้งานได้เลย!',
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('pa_share_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[1]; // Default to Nat Year 2 (u2) - great for a receiver view
  });

  const [currentRole, setCurrentRole] = useState<'donor' | 'receiver'>(() => {
    const saved = localStorage.getItem('pa_share_role');
    return saved ? (saved as 'donor' | 'receiver') : 'receiver';
  });

  const [activeConfirmItem, setActiveConfirmItem] = useState<DonationItem | null>(null);
  
  const [totalCompletedDonations, setTotalCompletedDonations] = useState<number>(() => {
    const saved = localStorage.getItem('pa_share_completed_count');
    return saved ? parseInt(saved, 10) : 5; // Default starts at 5 successful donations
  });

  // Keep LocalStorage Synced
  useEffect(() => {
    localStorage.setItem('pa_share_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('pa_share_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('pa_share_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pa_share_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pa_share_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('pa_share_completed_count', totalCompletedDonations.toString());
  }, [totalCompletedDonations]);

  // Expiration background worker (checks for 30-minute timer expirations every 3 seconds)
  useEffect(() => {
    const checkExpirations = () => {
      let updated = false;
      const now = Date.now();
      const expirationLimit = 30 * 60 * 1000; // 30 minutes in ms

      const nextDonations = donations.map((item) => {
        if (item.status === 'reserved' && item.reservedAt) {
          const reservedTime = new Date(item.reservedAt).getTime();
          if (now - reservedTime > expirationLimit) {
            updated = true;
            
            // Push expiration notification
            addNotification(
              `⏱️ สลายสิทธิ์จอง: ${item.title}`,
              `สิทธิ์การขอรับบริจาคหมดอายุเนื่องจากผู้เข้าร่วมไม่ได้รับการกดยืนยันทั้งสองฝ่ายในเวลา 30 นาที สิ่งของกลับคืนสถานะพร้อมรับแล้ว`,
              'warning'
            );

            return {
              ...item,
              status: 'available' as const,
              receiverId: null,
              receiverName: null,
              receiverContact: null,
              reservedAt: null,
              donorConfirmed: false,
              receiverConfirmed: false
            };
          }
        }
        return item;
      });

      if (updated) {
        setDonations(nextDonations);
        // If the active item is currently expired, close modal
        if (activeConfirmItem) {
          const freshItem = nextDonations.find(i => i.id === activeConfirmItem.id);
          if (freshItem && freshItem.status === 'available') {
            setActiveConfirmItem(null);
          }
        }
      }
    };

    const intervalId = setInterval(checkExpirations, 3000);
    return () => clearInterval(intervalId);
  }, [donations, activeConfirmItem]);

  // Helper to create notifications
  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'timer') => {
    const newNotif: Notification = {
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // DONOR ACTION: Register new donation
  const handleAddDonation = (newItem: {
    title: string;
    description: string;
    category: CategoryType;
    condition: ItemCondition;
    image: string;
    pickupPoint: string;
  }) => {
    const donation: DonationItem = {
      ...newItem,
      id: `d_${Date.now()}`,
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorContact: currentUser.contact,
      status: 'available',
      receiverId: null,
      receiverName: null,
      receiverContact: null,
      reservedAt: null,
      donorConfirmed: false,
      receiverConfirmed: false,
      createdAt: new Date().toISOString()
    };

    setDonations(prev => [donation, ...prev]);
    addNotification(
      '🎁 ลงโพสต์ปันสุขใหม่สำเร็จ!',
      `ท่านได้แบ่งปันสิ่งของใหม่: "${donation.title}" จุดรับมอบ: ${donation.pickupPoint}`,
      'success'
    );
  };

  // DONOR ACTION: Delete own donation
  const handleDeleteDonation = (id: string) => {
    const itemToDelete = donations.find(item => item.id === id);
    if (itemToDelete) {
      setDonations(prev => prev.filter(item => item.id !== id));
      addNotification(
        '🗑️ ลบประกาศปันสุขแล้ว',
        `โพสต์ "${itemToDelete.title}" ถูกลบออกจากระบบเรียบร้อย`,
        'info'
      );
      if (activeConfirmItem?.id === id) {
        setActiveConfirmItem(null);
      }
    }
  };

  // DONOR ACTION: Mark item as dropped off at pickup point
  const handleMarkAsDelivered = (id: string) => {
    setDonations(prev => prev.map(item => {
      if (item.id === id) {
        addNotification(
          '📍 วางสิ่งของเรียบร้อย!',
          `คุณวาง "${item.title}" ณ "${item.pickupPoint}" แล้ว! ระบบส่งข้อความแจ้งเตือนผู้รับเพื่อเข้ามารับของเสร็จสิ้นแล้ว`,
          'success'
        );
        return { ...item, status: 'delivered' };
      }
      return item;
    }));
  };

  // DONOR ACTION: Direct fulfill a request posted by a receiver
  const handleFulfillRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Open form or auto-create a matching donation post pre-filled
    const automaticTitle = `ตำรา/อุปกรณ์ตอบสนองคำขอ: ${req.title.replace('ต้องการด่วน:', '').replace('หาตำราเรียนวิชา:', '')}`;
    const automaticDonation: DonationItem = {
      id: `d_${Date.now()}`,
      title: automaticTitle,
      description: `สร้างขึ้นโดยอ้างอิงจากประกาศขอรับสิ่งของของ ${req.receiverName} รายละเอียด: ${req.description}`,
      category: req.category,
      condition: 'good',
      image: getCategoryPlaceholder(req.category),
      pickupPoint: 'สโมสรนักศึกษา รปศ. (ชั้น 2)',
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorContact: currentUser.contact,
      status: 'reserved', // Starts reserved directly for them
      receiverId: req.receiverId,
      receiverName: req.receiverName,
      receiverContact: req.receiverContact,
      reservedAt: new Date().toISOString(),
      donorConfirmed: true, // Donor auto-confirms since they initiated fulfillment
      receiverConfirmed: false,
      createdAt: new Date().toISOString()
    };

    setDonations(prev => [automaticDonation, ...prev]);
    
    // Fulfill the request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'fulfilled' } : r));

    addNotification(
      '🤝 ตอบรับคําขอรับของด่วน!',
      `ท่านได้เสนอมอบสิ่งของให้แก่ ${req.receiverName} แล้ว ระบบล็อคสิทธิ์คู่บริจาค 30 นาทีเรียบร้อยแล้ว`,
      'success'
    );

    // Open confirm modal automatically
    setActiveConfirmItem(automaticDonation);
  };

  // RECEIVER ACTION: Show interest in an available item
  const handleInterestClick = (itemId: string) => {
    setDonations(prev => prev.map(item => {
      if (item.id === itemId && item.status === 'available') {
        const reservedItem = {
          ...item,
          status: 'reserved' as const,
          receiverId: currentUser.id,
          receiverName: currentUser.name,
          receiverContact: currentUser.contact,
          reservedAt: new Date().toISOString(),
          donorConfirmed: false,
          receiverConfirmed: true // Receiver confirms immediately on clicking interest
        };
        
        addNotification(
          '⏱️ เริ่มระบบล็อคสิทธิ์ 30 นาที',
          `คุณได้แสดงความสนใจ "${item.title}" แล้ว กรุณารอผู้บริจาคกดยืนยันคู่กรณีภายใน 30 นาที`,
          'timer'
        );

        // Auto-open modal so they see the status
        setActiveConfirmItem(reservedItem);
        return reservedItem;
      }
      return item;
    }));
  };

  // RECEIVER ACTION: Mark item as picked up / completed
  const handleReceiveItem = (itemId: string) => {
    setDonations(prev => prev.map(item => {
      if (item.id === itemId) {
        addNotification(
          '🎉 มอบความสุขสำเร็จ!',
          `คุณได้รับมอบ "${item.title}" เรียบร้อยแล้ว ขอบคุณผู้แบ่งปันน้ำใจสำหรับสังคม รปศ. ของเรา!`,
          'success'
        );
        setTotalCompletedDonations(prev => prev + 1);
        return { ...item, status: 'completed' };
      }
      return item;
    }));
  };

  // RECEIVER ACTION: Post a request
  const handleAddRequest = (newItem: {
    title: string;
    description: string;
    category: CategoryType;
    urgency: UrgencyLevel;
  }) => {
    const request: RequestItem = {
      ...newItem,
      id: `r_${Date.now()}`,
      receiverId: currentUser.id,
      receiverName: currentUser.name,
      receiverContact: currentUser.contact,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setRequests(prev => [request, ...prev]);
    addNotification(
      '📝 โพสต์ขอรับสิ่งของสำเร็จ',
      `ท่านได้ลงประกาศต้องการ "${request.title}" ความเร่งด่วน: ${request.urgency === 'high' ? 'ด่วนมาก' : 'ทั่วไป'}`,
      'info'
    );
  };

  // RECEIVER ACTION: Delete request
  const handleDeleteRequest = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    addNotification(
      '🗑️ ลบประกาศคำขอแล้ว',
      `ประกาศตามหาของของคุณถูกนำออกจากระบบแล้ว`,
      'info'
    );
  };

  // DOUBLE CONFIRM: Trigger click confirm
  const handleConfirmPair = (itemId: string, role: 'donor' | 'receiver') => {
    setDonations(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item };
        if (role === 'donor') updatedItem.donorConfirmed = true;
        if (role === 'receiver') updatedItem.receiverConfirmed = true;

        // Check if both confirmed
        if (updatedItem.donorConfirmed && updatedItem.receiverConfirmed) {
          updatedItem.status = 'confirmed';
          updatedItem.reservedAt = null; // clear timer
          
          addNotification(
            '🤝 ยืนยันสิทธิ์บริจาคสำเร็จ!',
            `คู่บริจาคระหวาง ${updatedItem.donorName} และ ${updatedItem.receiverName} ได้รับการกดยืนยันสมบูรณ์! กรุณาดำเนินการจัดส่ง ณ "${updatedItem.pickupPoint}"`,
            'success'
          );
        }

        // Keep activeConfirmItem state synced if modal is open
        if (activeConfirmItem?.id === itemId) {
          setActiveConfirmItem(updatedItem);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  // DOUBLE CONFIRM: Cancel reservation
  const handleCancelReservation = (itemId: string) => {
    setDonations(prev => prev.map(item => {
      if (item.id === itemId) {
        addNotification(
          '❌ ยกเลิกสิทธิ์จับคู่เรียบร้อย',
          `สิทธิ์การจับคู่ของ "${item.title}" ถูกยกเลิกแล้ว สิ่งของได้กลับสู่กองปันสุขเพื่อให้นักศึกษาคนอื่นขอรับสิทธิ์`,
          'info'
        );
        return {
          ...item,
          status: 'available' as const,
          receiverId: null,
          receiverName: null,
          receiverContact: null,
          reservedAt: null,
          donorConfirmed: false,
          receiverConfirmed: false
        };
      }
      return item;
    }));
    setActiveConfirmItem(null);
  };

  // SIMULATOR: Fast-forward active timer 30 minutes to show expiration working
  const handleSimulateFastForward = () => {
    if (!activeConfirmItem || !activeConfirmItem.reservedAt) return;
    
    // Set reservedAt to 35 minutes ago so background worker triggers expiration instantly
    const pastTime = new Date(Date.now() - 35 * 60 * 1000).toISOString();
    
    setDonations(prev => prev.map(item => {
      if (item.id === activeConfirmItem.id) {
        return { ...item, reservedAt: pastTime };
      }
      return item;
    }));

    // Trigger immediate closure / status update on active modal state
    setActiveConfirmItem(prev => prev ? { ...prev, reservedAt: pastTime } : null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Dynamic Floating Action for testing */}
      <div className="bg-slate-900 text-slate-100 py-1.5 px-3 text-[11px] flex justify-between items-center border-b border-slate-800 shrink-0">
        <span className="flex items-center gap-1 font-mono">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span>[SYSTEM MODE: SIMULATOR ACTIVE]</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">สลับบทบาทได้ทันทีเพื่อทดสอบข้ามฝ่าย:</span>
          <button 
            type="button" 
            onClick={() => setCurrentRole(currentRole === 'donor' ? 'receiver' : 'donor')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px] transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-2.5 h-2.5" /> สลับเป็น {currentRole === 'donor' ? 'ผู้รับบริจาค' : 'ผู้บริจาค'}
          </button>
        </div>
      </div>

      {/* Main Navbar Navigation bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onClearNotifications={handleClearNotifications}
        totalCompletedDonations={totalCompletedDonations}
      />

      {/* Primary Application Page */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentRole === 'donor' ? (
          <DonorView
            donations={donations}
            requests={requests}
            currentUser={currentUser}
            onAddDonation={handleAddDonation}
            onDeleteDonation={handleDeleteDonation}
            onMarkAsDelivered={handleMarkAsDelivered}
            onFulfillRequest={handleFulfillRequest}
            onOpenConfirmModal={setActiveConfirmItem}
          />
        ) : (
          <ReceiverView
            donations={donations}
            requests={requests}
            currentUser={currentUser}
            onInterestClick={handleInterestClick}
            onReceiveItem={handleReceiveItem}
            onAddRequest={handleAddRequest}
            onDeleteRequest={handleDeleteRequest}
            onOpenConfirmModal={setActiveConfirmItem}
          />
        )}
      </main>

      {/* DOUBLE CONFIRM MODAL (If active item clicked) */}
      {activeConfirmItem && (
        <div className="relative">
          <DoubleConfirmModal
            item={activeConfirmItem}
            currentUser={currentUser}
            onConfirm={handleConfirmPair}
            onCancelReservation={handleCancelReservation}
            onSwitchUserToMatch={(userId) => {
              const matchedUser = MOCK_USERS.find(u => u.id === userId);
              if (matchedUser) {
                setCurrentUser(matchedUser);
              }
            }}
            onClose={() => setActiveConfirmItem(null)}
          />

          {/* Fast-Forward simulation trigger on screen */}
          {activeConfirmItem.status === 'reserved' && (
            <div className="fixed bottom-4 left-4 z-50 bg-slate-950/95 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl max-w-xs space-y-2 animate-bounce-subtle">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4" /> ปลั๊กอินจำลองย่นเวลา (30 นาที)
              </p>
              <p className="text-[10px] text-slate-400 leading-normal">
                เพื่อประหยัดเวลาการทดสอบระบบสลายสิทธิ์ ท่านสามารถคลิกเพื่อย่นเวลา 30 นาทีไปในอดีตได้ทันที
              </p>
              <button
                type="button"
                onClick={handleSimulateFastForward}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-extrabold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1"
              >
                ⏩ ย่นเวลาเป็นผ่านไปแล้ว 30 นาที
              </button>
            </div>
          )}
        </div>
      )}

      {/* Elegant Academic Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-16 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                <span className="font-sans font-bold text-lg tracking-wider">PA SHARE HUB</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                ระบบจัดการหมุนเวียนแบ่งปันทรัพยากร พัฒนาขึ้นสำหรับนิสิต/นักศึกษาสาขารัฐประศาสนศาสตร์ คณะมนุษยศาสตร์และสังคมศาสตร์ เพื่อมุ่งเน้นความเป็นมิตรต่อสิ่งแวดล้อมและช่วยเหลือเกื้อกูลกันตามแนวทางจิตสาธารณะ
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">📍 พิกัดตู้วางปันสุขหลัก</h4>
              <ul className="text-xs space-y-2">
                <li>• ตู้สโมสร รปศ. ชั้น 2 ตึกคณะ</li>
                <li>• โต๊ะม้าหินอ่อนด้านข้างคณะมนุษยศาสตร์ฯ</li>
                <li>• ชั้นวางของปันสุข ซุ้มทางเข้าด้านหน้าตึก 2</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">🛡️ มาตรการความปลอดภัย</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                ระบบล็อกสิทธิ์ 30 นาที ได้รับการออกแบบเพื่อป้องกันการกดกักตุนสิทธิ์สิ่งของ และให้แน่ใจว่าทั้งคู่ยินยอมพร้อมส่งมอบตรงเวลา ปลอดภัยจากการรับสิ่งของสวมสิทธิ์
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 สาขารัฐประศาสนศาสตร์ คณะมนุษยศาสตร์และสังคมศาสตร์. พัฒนาขึ้นเพื่อการกุศลและการแบ่งปัน.</p>
            <div className="flex gap-4">
              <span className="hover:text-amber-400 transition-colors cursor-pointer">เงื่อนไขการใช้งาน</span>
              <span className="hover:text-amber-400 transition-colors cursor-pointer">นโยบายความเป็นส่วนตัว</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
