export type PlacementTerms = {
  successFeePercent: number;
  depositCents: number;
  replacementGuaranteeDays: number;
};

function integerEnv(env: Record<string, string | undefined>, name: string, fallback: number, min: number, max: number) {
  const raw = env[name];
  if (raw == null || String(raw).trim() === "") return fallback;
  const text = String(raw).trim();
  if (!/^\d+$/.test(text)) throw new Error(`${name} must be a whole number.`);
  const value = Number(text);
  if (value < min || value > max) throw new Error(`${name} must be between ${min} and ${max}.`);
  return value;
}

export function readPlacementTerms(env: Record<string, string | undefined> = process.env): PlacementTerms {
  return {
    successFeePercent: integerEnv(env, "SUCCESS_FEE_PERCENT", 33, 0, 100),
    depositCents: integerEnv(env, "SEARCH_DEPOSIT_CENTS", 50_000, 0, 100_000_000),
    replacementGuaranteeDays: integerEnv(env, "REPLACEMENT_GUARANTEE_DAYS", 90, 0, 3650),
  };
}

export function successFeeCents(firstYearSalaryCents: number, percent: number) {
  if (!Number.isInteger(firstYearSalaryCents) || firstYearSalaryCents < 0) {
    throw new Error("Salary must be a whole number of cents.");
  }
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) {
    throw new Error("Fee percent must be a whole number from 0 to 100.");
  }
  return Math.round((firstYearSalaryCents * percent) / 100);
}

export function balanceAfterDeposit(feeCents: number, depositCents: number) {
  return Math.max(0, feeCents - depositCents);
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
