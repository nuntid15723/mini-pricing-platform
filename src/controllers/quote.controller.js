const quoteService = require("../services/quote.service");

//POST/quotes/price
exports.calculatePrice = (req, res) => {
  try {
    const result = quoteService.calculatePrice(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
//POST/quotes/bulk
exports.createBulkJob = (req, res) => {
  try {
    const jobId = quoteService.createJob(req.body);
    res.status(202).json({ job_id: jobId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//GET/quotes/job_id
exports.getJobStatus = (req, res) => {
  const job = quoteService.getJob(req.params.job_id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
};
