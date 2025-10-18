const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quote.controller");
const ruleController = require("../controllers/rule.controller");

//คำนวณราคาทันที
router.post("/quotes/price", quoteController.calculatePrice);

//คำนวณหลายรายการ
router.post("/quotes/bulk", quoteController.createBulkJob);

//ดูสถานะที่สร้างไว้
router.get("/quotes/jobs/:job_id", quoteController.getJobStatus);


//ดึงกฎทั้งหมด
router.get("/rules", ruleController.getAllRules);

//ดึงกฎตาม id
router.get("/rules/:id", ruleController.getRuleById);

//สร้างกฎใหม่
router.post("/rules", ruleController.createRule);

//อัปเดตกฎ
router.put("/rules/:id", ruleController.updateRule);

//ลบกฎ
router.delete("/rules/:id", ruleController.deleteRule);

module.exports = router;