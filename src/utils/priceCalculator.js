const ruleService = require("../services/rule.service");

exports.calculateBasePrice = ({ weight }) => {
  let price = 50;
  if (weight > 10) price += (weight - 10) * 5;
  return price;
};

exports.calculatePrice = ({ origin, destination, weight }) => {
  if (!origin || !destination || !weight) {
    throw new Error("Missing required fields");
  }

  let price = exports.calculateBasePrice({ weight });
  let applied_rules = ["BaseRate"];

  const rules = ruleService.getAll().filter((r) => r.is_active);
  const now = new Date();

  for (const rule of rules) {
    const start = new Date(rule.effective_from);
    const end = new Date(rule.effective_to);
    if (now < start || now > end) continue;

    // WeightTier
    if (rule.type === "WeightTier") {
      const { tiers } = rule.config;
      for (const tier of tiers) {
        const { min_weight, max_weight, price_per_kg } = tier;
        if (weight > min_weight) {
          const tierWeight = Math.min(weight, max_weight) - min_weight;
          if (tierWeight > 0) {
            price += tierWeight * price_per_kg;
            applied_rules.push(
              `Tier ${min_weight}-${max_weight}kg (+${tierWeight}×${price_per_kg})`
            );
          }
        }
      }
    }

    // Promotion
    if (rule.type === "TimeWindowPromotion") {
      const { discount_percent } = rule.config;
      if (discount_percent > 0) {
        const discount = (price * discount_percent) / 100;
        price -= discount;
        applied_rules.push(`Promotion (-${discount_percent}%)`);
      }
    }

    // Remote area
    if (rule.type === "RemoteAreaSurcharge") {
      const { areas, surcharge } = rule.config;
      if (areas && areas.includes(destination)) {
        price += surcharge || 0;
        applied_rules.push(`RemoteArea (+${surcharge})`);
      }
    }
  }

  return { origin, destination, weight, price, applied_rules };
};
