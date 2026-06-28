/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, DonationItem, RequestItem, PickupPoint, User } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'textbook',
    name: 'ตำราเรียน / หนังสือ',
    icon: 'BookOpen',
    color: 'emerald',
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textClass: 'text-emerald-700'
  },
  {
    id: 'uniform',
    name: 'เครื่องแต่งกาย / ชุดนักศึกษา',
    icon: 'Shirt',
    color: 'indigo',
    bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textClass: 'text-indigo-700'
  },
  {
    id: 'it_device',
    name: 'อุปกรณ์ไอที / แกดเจ็ต',
    icon: 'Laptop',
    color: 'amber',
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
    textClass: 'text-amber-700'
  },
  {
    id: 'stationery',
    name: 'เครื่องเขียน',
    icon: 'PenTool',
    color: 'pink',
    bgClass: 'bg-pink-50 text-pink-700 border-pink-200',
    textClass: 'text-pink-700'
  },
  {
    id: 'study_sheet',
    name: 'ชีทสรุป / แนวข้อสอบ',
    icon: 'FileText',
    color: 'violet',
    bgClass: 'bg-violet-50 text-violet-700 border-violet-200',
    textClass: 'text-violet-700'
  },
  {
    id: 'sports',
    name: 'กีฬา / นันทนาการ',
    icon: 'Dribbble',
    color: 'sky',
    bgClass: 'bg-sky-50 text-sky-700 border-sky-200',
    textClass: 'text-sky-700'
  },
  {
    id: 'general',
    name: 'ของใช้ทั่วไป',
    icon: 'Gift',
    color: 'slate',
    bgClass: 'bg-slate-50 text-slate-700 border-slate-200',
    textClass: 'text-slate-700'
  }
];

export const PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'p1',
    name: 'สโมสรนักศึกษา รปศ. (ชั้น 2)',
    description: 'หน้าห้องสโมสรนักศึกษาสาขารัฐประศาสนศาสตร์ มีชั้นวางสีส้มตั้งอยู่',
    floor: 'ชั้น 2 ตึกคณะ',
    coordinates: { x: 45, y: 35 }
  },
  {
    id: 'p2',
    name: 'ใต้ตึกคณะมนุษยศาสตร์ฯ (โต๊ะม้าหินอ่อน)',
    description: 'ลานโต๊ะม้าหินอ่อน ฝั่งทิศตะวันออก ติดกับร้านสหกรณ์คณะ',
    floor: 'ชั้น 1 ใต้ถุนตึก',
    coordinates: { x: 25, y: 75 }
  },
  {
    id: 'p3',
    name: 'บอร์ดประชาสัมพันธ์ รปศ. (ชั้น 3)',
    description: 'บริเวณหน้าลิฟต์ชั้น 3 ข้างบอร์ดสรุปกิจกรรมสาขา',
    floor: 'ชั้น 3 ตึกคณะ',
    coordinates: { x: 75, y: 30 }
  },
  {
    id: 'p4',
    name: 'โถงบันไดหน้าตึก 2 (จุดวางของปันสุข)',
    description: 'ชั้นวางของแบ่งปันไม้พาเลท บริเวณซุ้มทางเข้าด้านหน้าตึก 2',
    floor: 'ชั้น 1 ทางเข้าหลัก',
    coordinates: { x: 50, y: 85 }
  },
  {
    id: 'p5',
    name: 'ตู้น้ำดื่มบริการสังคมประชารัฐ',
    description: 'มุมพักผ่อนชั้น 2 ข้างตู้กดน้ำสาธารณะ เหมาะสำหรับของขนาดเล็ก',
    floor: 'ชั้น 2 ตึกคณะ',
    coordinates: { x: 60, y: 55 }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'ชลสิทธิ์ แสงสุวรรณ (พี่ชล ปี 4)',
    studentId: '66102010145',
    major: 'รัฐประศาสนศาสตร์',
    year: '4',
    contact: '089-123-4567 | FB: Cholasit Sang'
  },
  {
    id: 'u2',
    name: 'ณัฐนันท์ พรอุดม (นัท ปี 2)',
    studentId: '68102010211',
    major: 'รัฐประศาสนศาสตร์',
    year: '2',
    contact: '081-987-6543 | Line: natthanan_p'
  },
  {
    id: 'u3',
    name: 'ธัญญาเรศ รุ่งเรือง (ฝน ปี 3)',
    studentId: '67102010098',
    major: 'รัฐประศาสนศาสตร์',
    year: '3',
    contact: '085-555-4433 | IG: fon.thanya'
  },
  {
    id: 'u4',
    name: 'พีรภัทร ชาติไทย (พี ปี 1)',
    studentId: '69102010321',
    major: 'รัฐประศาสนศาสตร์',
    year: '1',
    contact: '090-222-1111 | Line: pee_peerapat'
  }
];

// Helper to get image placeholder based on category
export const getCategoryPlaceholder = (category: string): string => {
  switch (category) {
    case 'textbook':
      return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500';
    case 'uniform':
      return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=500';
    case 'it_device':
      return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=500';
    case 'stationery':
      return 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500';
    case 'study_sheet':
      return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500';
    case 'sports':
      return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=500';
    default:
      return 'https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=500';
  }
};

export const INITIAL_DONATIONS: DonationItem[] = [
  {
    id: 'd1',
    title: 'ตำรา นโยบายสาธารณะและการวางแผนแผนงาน',
    description: 'วิชาเอกบังคับสำหรับนักศึกษา รปศ. สภาพภายนอกดีมาก มีรอยขีดเขียนจดเลกเชอร์ด้วยดินสอบางหน้า นำไปใช้อ่านทบทวนสอบกลางภาคได้เลยครับ',
    category: 'textbook',
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500',
    pickupPoint: 'สโมสรนักศึกษา รปศ. (ชั้น 2)',
    donorId: 'u1',
    donorName: 'ชลสิทธิ์ แสงสุวรรณ (พี่ชล ปี 4)',
    donorContact: '089-123-4567 | FB: Cholasit Sang',
    status: 'available',
    receiverId: null,
    receiverName: null,
    receiverContact: null,
    reservedAt: null,
    donorConfirmed: false,
    receiverConfirmed: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString() // 4 hours ago
  },
  {
    id: 'd2',
    title: 'เนคไทสีกรมท่าและเข็มกลัดสาขา รปศ.',
    description: 'สำหรับน้องๆ ปี 1 ที่กำลังเตรียมตัวร่วมพิธีปฐมนิเทศหรือกิจกรรมทางการครับ สภาพเกือบ 100% พี่ส่งต่อให้ฟรีเพราะเรียนจบแล้วครับ',
    category: 'uniform',
    condition: 'like_new',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=500',
    pickupPoint: 'ตู้น้ำดื่มบริการสังคมประชารัฐ',
    donorId: 'u1',
    donorName: 'ชลสิทธิ์ แสงสุวรรณ (พี่ชล ปี 4)',
    donorContact: '089-123-4567 | FB: Cholasit Sang',
    status: 'available',
    receiverId: null,
    receiverName: null,
    receiverContact: null,
    reservedAt: null,
    donorConfirmed: false,
    receiverConfirmed: false,
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString() // 10 hours ago
  },
  {
    id: 'd3',
    title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-350MS',
    description: 'ใช้เรียนในวิชาการวิจัยและสถิติสำหรับผู้บริหารรัฐประศาสนศาสตร์ มีประโยชน์มาก ไม่ต้องซื้อใหม่ราคาเกือบพัน ปุ่มกดได้ครบทุกปุ่ม ตัวหนังสือชัดเจน',
    category: 'it_device',
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=500',
    pickupPoint: 'ใต้ตึกคณะมนุษยศาสตร์ฯ (โต๊ะม้าหินอ่อน)',
    donorId: 'u3',
    donorName: 'ธัญญาเรศ รุ่งเรือง (ฝน ปี 3)',
    donorContact: '085-555-4433 | IG: fon.thanya',
    status: 'available',
    receiverId: null,
    receiverName: null,
    receiverContact: null,
    reservedAt: null,
    donorConfirmed: false,
    receiverConfirmed: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString() // 1 day ago
  },
  {
    id: 'd4',
    title: 'สรุปสอบกฎหมายปกครองและการบริหารงานภาครัฐ',
    description: 'สรุปประเด็นหลักๆ และคีย์เวิร์ดสำคัญที่มักออกสอบวิชากฎหมายปกครอง พี่รวบรวมพอยต์และแนวเขียนตอบมาให้ในไฟล์ปริ้นเรียบร้อย มีทั้งหมด 12 แผ่น',
    category: 'study_sheet',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500',
    pickupPoint: 'บอร์ดประชาสัมพันธ์ รปศ. (ชั้น 3)',
    donorId: 'u3',
    donorName: 'ธัญญาเรศ รุ่งเรือง (ฝน ปี 3)',
    donorContact: '085-555-4433 | IG: fon.thanya',
    status: 'available',
    receiverId: null,
    receiverName: null,
    receiverContact: null,
    reservedAt: null,
    donorConfirmed: false,
    receiverConfirmed: false,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString() // 1 hour ago
  },
  {
    id: 'd5',
    title: 'ชุดปากกาเจลสีหัวเข็ม + ไฮไลท์สะท้อนแสง',
    description: 'มีปากกาแดง น้ำเงิน ดำ และไฮไลท์สีพาสเทล 4 ด้าม เอาไว้ไปจดช็อตโน้ตเวลาเรียนวิชาต่างๆ สภาพยังใช้ได้เยอะมาก ซื้อมาซ้ำไม่ได้ใช้เลยเอามาแบ่งปันค่ะ',
    category: 'stationery',
    condition: 'new',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500',
    pickupPoint: 'โถงบันไดหน้าตึก 2 (จุดวางของปันสุข)',
    donorId: 'u2',
    donorName: 'ณัฐนันท์ พรอุดม (นัท ปี 2)',
    donorContact: '081-987-6543 | Line: natthanan_p',
    status: 'available',
    receiverId: null,
    receiverName: null,
    receiverContact: null,
    reservedAt: null,
    donorConfirmed: false,
    receiverConfirmed: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString() // 2 hours ago
  }
];

export const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'r1',
    title: 'ต้องการด่วน: เสื้อโปโลสีทองตรามหาวิทยาลัย (เสื้อสาขา รปศ.) ไซส์ M-L',
    description: 'ต้องใช้ใส่ทำกิจกรรมจิตอาสาประจำสาขาอาทิตย์หน้าครับ ใครมีที่ไม่ได้ใส่แล้ว ขอรบกวนส่งต่อหน่อยนะครับ ขอบคุณล่วงหน้าครับ!',
    category: 'uniform',
    urgency: 'high',
    receiverId: 'u4',
    receiverName: 'พีรภัทร ชาติไทย (พี ปี 1)',
    receiverContact: '090-222-1111 | Line: pee_peerapat',
    status: 'active',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString() // 5 hours ago
  },
  {
    id: 'r2',
    title: 'หาตำราเรียนวิชา: การบริหารองค์การและการจัดการ (Organization & Management)',
    description: 'ใครลงเรียนเทอมก่อนแล้วอยากส่งต่อตำราบ้างคะ พอดีหาซื้อที่ศูนย์หนังสือแล้วพรีออเดอร์นานมาก เกรงว่าจะอ่านสอบไม่ทันค่ะ',
    category: 'textbook',
    urgency: 'medium',
    receiverId: 'u2',
    receiverName: 'ณัฐนันท์ พรอุดม (นัท ปี 2)',
    receiverContact: '081-987-6543 | Line: natthanan_p',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 3600000).toISOString() // 15 hours ago
  },
  {
    id: 'r3',
    title: 'ขอรับบริจาคร่มพับหรืออุปกรณ์กันฝนพกพาง่าย',
    description: 'ช่วงนี้ฝนตกบ่อยมากตอนเย็น เดินเรียนระหว่างตึกมนุษย์ฯ ไปตึกวิจัย ต้องเปียกฝนตลอดเลยค่ะ ใครมีร่มเก่าสภาพพอใช้ได้ที่ไม่ได้ใช้แล้วขอแบ่งปันนะคะ',
    category: 'general',
    urgency: 'low',
    receiverId: 'u3',
    receiverName: 'ธัญญาเรศ รุ่งเรือง (ฝน ปี 3)',
    receiverContact: '085-555-4433 | IG: fon.thanya',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 3600000).toISOString() // 30 hours ago
  }
];
