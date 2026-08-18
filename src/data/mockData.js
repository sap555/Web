// Initial Seed Data for Village Management System (ระบบสารสนเทศประชากรและขอบเขตหมู่บ้าน)

export const INITIAL_VILLAGES = [
  {
    id: "moo-1",
    mooNumber: 1,
    name: "บ้านดอนงาม",
    headman: "นายสมชาย ใจดี",
    headmanPhone: "xxx-xxx-xxxx",
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
    headmanPhone: "xxx-xxx-xxxx",
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
    headmanPhone: "xxx-xxx-xxxx",
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
    headmanPhone: "xxx-xxx-xxxx",
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
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    gender: "ชาย",
    age: 54,
    houseNo: "12/1",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "เกษตรกร / ผู้ใหญ่บ้าน",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5310,
    lng: 100.9180
  },
  {
    id: "res-002",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาง",
    firstName: "สมศรี",
    lastName: "ใจดี",
    gender: "หญิง",
    age: 51,
    houseNo: "12/1",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "ค้าขาย",
    phone: "xxx-xxx-xxxx",
    status: "ผู้อยู่อาศัย",
    lat: 14.5310,
    lng: 100.9180
  },
  {
    id: "res-003",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "กิตติ",
    lastName: "พงษ์พาณิชย์",
    gender: "ชาย",
    age: 28,
    houseNo: "45",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "พนักงานบริษัท",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5295,
    lng: 100.9215
  },
  {
    id: "res-004",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "วิชัย",
    lastName: "รุ่งเรือง",
    gender: "ชาย",
    age: 48,
    houseNo: "88/2",
    moo: 2,
    villageName: "บ้านหนองบัว",
    occupation: "รับราชการ / ผู้ใหญ่บ้าน",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5360,
    lng: 100.9330
  },
  {
    id: "res-005",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นางสาว",
    firstName: "อารียา",
    lastName: "รุ่งเรือง",
    gender: "หญิง",
    age: 22,
    houseNo: "88/2",
    moo: 2,
    villageName: "บ้านหนองบัว",
    occupation: "นักศึกษา",
    phone: "xxx-xxx-xxxx",
    status: "ผู้อยู่อาศัย",
    lat: 14.5360,
    lng: 100.9330
  },
  {
    id: "res-006",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาง",
    firstName: "บุญนำ",
    lastName: "ศรีสุข",
    gender: "หญิง",
    age: 62,
    houseNo: "3/1",
    moo: 3,
    villageName: "บ้านโคกสว่าง",
    occupation: "ทำสวน / ผู้ใหญ่บ้าน",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5230,
    lng: 100.9260
  },
  {
    id: "res-007",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "มานพ",
    lastName: "ศรีสุข",
    gender: "ชาย",
    age: 65,
    houseNo: "3/1",
    moo: 3,
    villageName: "บ้านโคกสว่าง",
    occupation: "บำนาญ",
    phone: "xxx-xxx-xxxx",
    status: "ผู้อยู่อาศัย",
    lat: 14.5230,
    lng: 100.9260
  },
  {
    id: "res-008",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "ประเสริฐ",
    lastName: "ยั่งยืน",
    gender: "ชาย",
    age: 50,
    houseNo: "109",
    moo: 4,
    villageName: "บ้านป่าไร่พัฒนา",
    occupation: "เกษตรกร / ผู้ใหญ่บ้าน",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5440,
    lng: 100.9280
  },
  {
    id: "res-009",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นางสาว",
    firstName: "พิมพ์ใจ",
    lastName: "ยั่งยืน",
    gender: "หญิง",
    age: 26,
    houseNo: "109",
    moo: 4,
    villageName: "บ้านป่าไร่พัฒนา",
    occupation: "ครูโรงเรียนชุมชน",
    phone: "xxx-xxx-xxxx",
    status: "ผู้อยู่อาศัย",
    lat: 14.5440,
    lng: 100.9280
  },
  {
    id: "res-010",
    citizenId: "x-xxxx-xxxxx-xx-x",
    prefix: "นาย",
    firstName: "ธนกร",
    lastName: "เจริญพร",
    gender: "ชาย",
    age: 39,
    houseNo: "77/4",
    moo: 1,
    villageName: "บ้านดอนงาม",
    occupation: "ธุรกิจส่วนตัว",
    phone: "xxx-xxx-xxxx",
    status: "เจ้าบ้าน",
    lat: 14.5330,
    lng: 100.9240
  }
];

export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

export const DEMO_USER = {
  name: "แอดมิน",
  role: "เจ้าหน้าที่ทะเบียนท้องถิ่น / ผู้บริหาร",
  villageSubdistrict: "ตำบลเขาใหญ่ อ.ปากช่อง จ.นครราชสีมา",
  email: "admin@village-portal.go.th"
};
