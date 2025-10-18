let rules = [
  {
    id: 1,
    type: "WeightTier",
    priority: 1,
    effective_from: "2025-01-01",
    effective_to: "2025-12-31",
    is_active: true,
    config: {
      tiers: [
        { min_weight: 0, max_weight: 10, price_per_kg: 5 },
        { min_weight: 10, max_weight: 30, price_per_kg: 4 },
        { min_weight: 30, max_weight: 100, price_per_kg: 3.5 }
      ]
    },
  },
];

//ดึงทั้งหมด
exports.getAll = () => rules;

//ดึงตาม id
exports.getById = (id) => rules.find((r) => r.id === id);

//สร้างใหม่ rule validation
exports.create = (data) => {
  let id = data.id;
  const { type, priority, effective_from, effective_to, is_active, config } = data;

  //ถ้าไม่ส่ง id มา id ล่าสุด +1
  if (!id) {
    id = rules.length ? rules[rules.length - 1].id + 1 : 1;
  }
  //ถ้าidซ้ำ +1 ไปเรื่อยๆ
  while (rules.find((r) => r.id === id)) {
    console.warn(`Rule ID ${id} already exists.`);
    id += 1;
  }

  //ต้องมี effective_from และ effective_to
  if (!effective_from || !effective_to) {
    throw new Error("effective_from and effective_to are required");
  }

  //ตรวจสอบรูปแบบวันที่
  if (isNaN(Date.parse(effective_from)) || isNaN(Date.parse(effective_to))) {
    throw new Error("Invalid date format");
  }

  //สร้าง rule ใหม่
  const newRule = {
    id,
    type: type || "Custom",
    priority: priority || 1,
    effective_from,
    effective_to,
    is_active: is_active ?? true,
    config: config || {},
  };

  rules.push(newRule);
  return newRule;
};


//อัปเดต
exports.update = (id, data) => {
  const index = rules.findIndex((r) => r.id === id);
  if (index === -1) return null;

  //ห้าม id ซ้ำกัน
  if (data.id && data.id !== id) {
    const dup = rules.find((r) => r.id === data.id);
    if (dup) {
      throw new Error(`Cannot id ${data.id}`);
    }
  }

  //เช็ควันที่
  if (data.effective_from && !data.effective_to) {
    throw new Error("effective_to is required");
  }
  if (!data.effective_from && data.effective_to) {
    throw new Error("effective_from is required");
  }

  rules[index] = { ...rules[index], ...data };
  return rules[index];
};
//ลบ
exports.remove = (id) => {
  const index = rules.findIndex((r) => r.id === id);
  if (index === -1) return false;
  rules.splice(index, 1);
  return true;
};
