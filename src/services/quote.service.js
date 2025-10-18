const { calculatePrice } = require("../utils/priceCalculator");

let jobs = {};

//คำนวณราคาทันที
exports.calculatePrice = (data) => {
  return calculatePrice(data); //ให้ util คิดทุกอย่าง
};

//คำนวณราคาหลายรายการ (bulk)
exports.createJob = (list) => {
  if (!Array.isArray(list)) throw new Error("Request body must be an array");

  const jobId = "JOB-" + new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  const totalRequests = list.length;

  //เริ่มต้น
  jobs[jobId] = {
    job_id: jobId,
    status: "processing",
    total_requests: totalRequests,
    created_at: new Date().toISOString(),
    results: [],
  };

  //ประมวลผลแบบอะซิงโครนัส
  setTimeout(() => {
    const results = list.map((item) => {
      try {
        return calculatePrice({
          origin: item.origin?.trim(),
          destination: item.destination?.trim(),
          weight: parseFloat(item.weight),
        });
      } catch (err) {
        return { ...item, error: err.message };
      }
    });

    jobs[jobId].status = "completed";
    jobs[jobId].completed_at = new Date().toISOString();
    jobs[jobId].results = results;
  }, 500);

  return {
    job_id: jobId,
    status: "processing",
    total_requests: totalRequests,
  };
};

//ตรวจสอบสถานะ job
exports.getJob = (jobId) => jobs[jobId];
