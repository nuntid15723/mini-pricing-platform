const ruleService = require("../services/rule.service");
//GET/rules
exports.getAllRules = (req, res) => {
  res.json(ruleService.getAll());
};
//GET/rules/id
exports.getRuleById = (req, res) => {
  const rule = ruleService.getById(parseInt(req.params.id));
  if (!rule) return res.status(404).json({ message: "Rule not found" });
  res.json(rule);
};
//POST/rules
exports.createRule = (req, res) => {
  const rule = ruleService.create(req.body);
  res.status(201).json(rule);
};
//PUT/rules/id
exports.updateRule = (req, res) => {
  const updated = ruleService.update(parseInt(req.params.id), req.body);
  if (!updated) return res.status(404).json({ message: "Rule not found" });
  res.json(updated);
};
//DELETE/rules/id
exports.deleteRule = (req, res) => {
  const success = ruleService.remove(parseInt(req.params.id));
  if (!success) return res.status(404).json({ message: "Rule not found" });
  res.json({ message: "Deleted" });
};
