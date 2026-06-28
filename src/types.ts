/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 
  | 'textbook'      // การเรียน / ตำราเรียน
  | 'uniform'       // เครื่องแต่งกาย / ชุดนักศึกษา
  | 'it_device'     // อุปกรณ์ไอที / แกดเจ็ต
  | 'stationery'    // เครื่องเขียน
  | 'study_sheet'   // ชีทสรุป / แนวข้อสอบ
  | 'sports'        // อุปกรณ์กีฬา / นันทนาการ
  | 'general';      // ของใช้ทั่วไป

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  bgClass: string;
  textClass: string;
}

export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair';

export type DonationStatus = 
  | 'available'     // พร้อมส่งต่อ
  | 'reserved'      // อยู่ในระบบล็อคสิทธิ์ (30 นาที)
  | 'confirmed'     // ยืนยันคู่บริจาคแล้ว / รอการนำส่ง
  | 'delivered'     // ส่ง ณ จุดรับของเรียบร้อย
  | 'completed';    // รับสิ่งของเสร็จสิ้น

export interface DonationItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  condition: ItemCondition;
  image: string; // base64 or placeholder URL
  pickupPoint: string;
  donorId: string;
  donorName: string;
  donorContact: string;
  status: DonationStatus;
  receiverId: string | null;
  receiverName: string | null;
  receiverContact: string | null;
  reservedAt: string | null; // ISO string when user clicked interest
  donorConfirmed: boolean;
  receiverConfirmed: boolean;
  createdAt: string;
}

export type RequestStatus = 'active' | 'fulfilled';
export type UrgencyLevel = 'low' | 'medium' | 'high';

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  urgency: UrgencyLevel;
  receiverId: string;
  receiverName: string;
  receiverContact: string;
  status: RequestStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'timer';
  createdAt: string;
  read: boolean;
}

export interface PickupPoint {
  id: string;
  name: string;
  description: string;
  floor: string;
  coordinates: { x: number; y: number }; // For visual map representation
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  major: string;
  year: string;
  contact: string;
}
