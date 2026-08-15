// Initial Seed Data for Village Management System (ระบบสารสนเทศประชากรและขอบเขตหมู่บ้าน)

export const INITIAL_VILLAGES = [
  {
    id: "moo-1",
    mooNumber: 1,
    name: "บ้านดอนงาม",
    headman: "นายสมชาย ใจดี",
    headmanPhone: "081-234-5678",
    color: "#3B82F6", // Blue
    boundary: [
      [14.528, 100.912],
      [14.535, 100.915],
      [14.538, 100.925],
      [14.530, 100.928],
      [14.524, 100.920]
    ]
  },
  {
    id: "moo-2",
    mooNumber: 2,
    name: "บ้านหนองบัว",
    headman: "นายวิชัย รุ่งเรือง",
    headmanPhone: "089-876-5432",
    color: "#10B981", // Emerald Green
    boundary: [
      [14.530, 100.928],
      [14.538, 100.925],
      [14.545, 100.932],
      [14.540, 100.942],
      [14.528, 100.938]
    ]
  },
  {
    id: "moo-3",
    mooNumber: 3,
    name: "บ้านโคกสว่าง",
    headman: "นางบุญนำ ศรีสุข",
    headmanPhone: "086-555-1234",
    color: "#F59E0B", // Amber
    boundary: [
      [14.520, 100.920],
      [14.524, 100.920],
      [14.530, 100.928],
      [14.528, 100.938],
      [14.518, 100.932]
    ]
  },
  {
    id: "moo-4",
    mooNumber: 4,
    name: "บ้านป่าไร่พัฒนา",
    headman: "นายประเสริฐ ยั่งยืน",
    headmanPhone: "082-333-7890",
    color: "#8B5CF6", // Purple
    boundary: [
      [14.538, 100.925],
      [14.548, 100.922],
      [14.552, 100.930],
      [14.545, 100.932]
    ]
  }
];

export const INITIAL_RESIDENTS = [
  {
    id: "res-001",
    citizenId: "1-1002-00345-12-1",
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    gender: "ชาย",
    age: 54,
    houseNo: "12/1",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "เกษตรกร / ผู้ใหญ่บ้าน",
    phone: "081-234-5678",
    status: "เจ้าบ้าน",
    lat: 14.5310,
    lng: 100.9180
  },
  {
    id: "res-002",
    citizenId: "3-1002-00345-12-2",
    prefix: "นาง",
    firstName: "สมศรี",
    lastName: "ใจดี",
    gender: "หญิง",
    age: 51,
    houseNo: "12/1",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "ค้าขาย",
    phone: "081-234-5679",
    status: "ผู้อยู่อาศัย",
    lat: 14.5310,
    lng: 100.9180
  },
  {
    id: "res-003",
    citizenId: "1-1002-00888-55-9",
    prefix: "นาย",
    firstName: "กิตติ",
    lastName: "พงษ์พาณิชย์",
    gender: "ชาย",
    age: 28,
    houseNo: "45",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "พนักงานบริษัท",
    phone: "084-111-2233",
    status: "เจ้าบ้าน",
    lat: 14.5295,
    lng: 100.9215
  },
  {
    id: "res-004",
    citizenId: "1-2005-00123-99-4",
    prefix: "นาย",
    firstName: "วิชัย",
    lastName: "รุ่งเรือง",
    gender: "ชาย",
    age: 48,
    houseNo: "88/2",
    moo: 2,
    villageName: "บ้านหนองบัว",
    occupation: "รับราชการ / ผู้ใหญ่บ้าน",
    phone: "089-876-5432",
    status: "เจ้าบ้าน",
    lat: 14.5360,
    lng: 100.9330
  },
  {
    id: "res-005",
    citizenId: "3-2005-00123-99-5",
    prefix: "นางสาว",
    firstName: "อารียา",
    lastName: "รุ่งเรือง",
    gender: "หญิง",
    age: 22,
    houseNo: "88/2",
    moo: 2,
    villageName: "บ้านหนองบัว",
    occupation: "นักศึกษา",
    phone: "089-876-9999",
    status: "ผู้อยู่อาศัย",
    lat: 14.5360,
    lng: 100.9330
  },
  {
    id: "res-006",
    citizenId: "1-3001-00444-11-2",
    prefix: "นาง",
    firstName: "บุญนำ",
    lastName: "ศรีสุข",
    gender: "หญิง",
    age: 62,
    houseNo: "3/1",
    moo: 3,
    villageName: "บ้านโคกสว่าง",
    occupation: "ทำสวน / ผู้ใหญ่บ้าน",
    phone: "086-555-1234",
    status: "เจ้าบ้าน",
    lat: 14.5230,
    lng: 100.9260
  },
  {
    id: "res-007",
    citizenId: "1-3001-00444-11-3",
    prefix: "นาย",
    firstName: "มานพ",
    lastName: "ศรีสุข",
    gender: "ชาย",
    age: 65,
    houseNo: "3/1",
    moo: 3,
    villageName: "บ้านโคกสว่าง",
    occupation: "บำนาญ",
    phone: "086-555-4321",
    status: "ผู้อยู่อาศัย",
    lat: 14.5230,
    lng: 100.9260
  },
  {
    id: "res-008",
    citizenId: "1-4009-00777-33-8",
    prefix: "นาย",
    firstName: "ประเสริฐ",
    lastName: "ยั่งยืน",
    gender: "ชาย",
    age: 50,
    houseNo: "109",
    moo: 4,
    villageName: "บ้านป่าไร่พัฒนา",
    occupation: "เกษตรกร / ผู้ใหญ่บ้าน",
    phone: "082-333-7890",
    status: "เจ้าบ้าน",
    lat: 14.5440,
    lng: 100.9280
  },
  {
    id: "res-009",
    citizenId: "2-4009-00777-33-9",
    prefix: "นางสาว",
    firstName: "พิมพ์ใจ",
    lastName: "ยั่งยืน",
    gender: "หญิง",
    age: 26,
    houseNo: "109",
    moo: 4,
    villageName: "บ้านป่าไร่พัฒนา",
    occupation: "ครูโรงเรียนชุมชน",
    phone: "082-333-7891",
    status: "ผู้อยู่อาศัย",
    lat: 14.5440,
    lng: 100.9280
  },
  {
    id: "res-010",
    citizenId: "1-1002-00999-00-1",
    prefix: "นาย",
    firstName: "ธนกร",
    lastName: "เจริญพร",
    gender: "ชาย",
    age: 39,
    houseNo: "77/4",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "ธุรกิจส่วนตัว",
    phone: "088-999-0000",
    status: "เจ้าบ้าน",
    lat: 14.5330,
    lng: 100.9240
  }
];

export const DEMO_USER = {
  name: "แอดมิน",
  role: "เจ้าหน้าที่ทะเบียนท้องถิ่น / ผู้บริหาร",
  villageSubdistrict: "ตำบลเขาใหญ่ อ.ปากช่อง จ.นครราชสีมา",
  email: "admin@village-portal.go.th"
};
