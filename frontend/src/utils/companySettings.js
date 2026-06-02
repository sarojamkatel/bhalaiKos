// Per-tenant company settings with strict localStorage isolation.
// Each tenant's data lives under a unique key so no cross-company leakage is possible.

const DEFAULT_SETTINGS = {
  companyName: "Insurance Company",
  shortName: "INSURANCE COMPANY",
  initials: "IC",
  address: "",
  phone: "",
  email: "",
  website: "",
  subdomain: "",
  logo: null,           // base64 data URL or null
  contactPerson: "",
  contactPhone: "",
  receiptMessage:
    "Please keep this receipt safely. It serves as proof of vehicle insurance registration and may be required for claims, renewals, or legal purposes.",
  accidentInstructions: [
    "Immediately contact our company representative and report the accident without delay.",
    "Do not intervene at the accident scene or move any vehicle without first informing the police.",
    "File a First Information Report (FIR) at the nearest police station and obtain a copy.",
    "Provide necessary vehicle documents — Bluebook, Insurance certificate, and driving licence — when filing the claim.",
    "Do not negotiate with any third party or sign any settlement without prior consultation with our company.",
  ],
};

// Seed data for known tenants — used as base before any admin customisation.
// In a real app this would come from the backend on login.
const TENANT_SEEDS = {
  nawakantipurinsurance: {
    companyName: "Nawa Kantipur Insurance Pvt. Ltd.",
    shortName: "NAWA KANTIPUR INSURANCE",
    initials: "NKI",
    address: "Putalisadak, Kathmandu, Nepal",
    phone: "+977-01-4234567",
    email: "contact@nawakantipurinsurance.com",
    website: "https://nawakantipurinsurance.com",
    subdomain: "nawakantipurinsurance",
    logo: null,
    contactPerson: "Bikram Shrestha (Branch Manager)",
    contactPhone: "+977-9801234567",
    receiptMessage:
      "Please keep this receipt safely. It serves as proof of vehicle insurance registration and may be required for claims, renewals, or legal purposes.",
    accidentInstructions: [
      "Immediately contact Bikram Shrestha (Branch Manager) at +977-9801234567 and report the accident without delay.",
      "Do not intervene at the accident scene or move any vehicle without first informing the police.",
      "File a First Information Report (FIR) at the nearest police station and obtain a copy of the report.",
      "Provide necessary vehicle documents — Bluebook, Insurance certificate, and driving licence — when filing the claim with our company.",
      "Do not negotiate with any third party or sign any settlement without prior consultation with our company.",
    ],
  },
};

// Maps the demo auth role to its tenant slug.
// In a real app this mapping comes from the decoded JWT / session.
const ROLE_TENANT_MAP = {
  admin: "nawakantipurinsurance",
  staff: "nawakantipurinsurance",
};

export function getTenantSlug(role) {
  return ROLE_TENANT_MAP[role] ?? null;
}

// Returns merged settings: defaults ← seed ← admin-saved overrides.
// Safe to call from any role; isolation is enforced by the unique key per slug.
export function getCompanySettings(tenantSlug) {
  const base = { ...DEFAULT_SETTINGS, ...(TENANT_SEEDS[tenantSlug] ?? {}) };
  if (!tenantSlug) return base;
  try {
    const raw = localStorage.getItem(`bk_settings_${tenantSlug}`);
    if (raw) return { ...base, ...JSON.parse(raw) };
  } catch {
    // ignore malformed stored data
  }
  return base;
}

// Admin-only save. Caller must verify the user's role before calling.
export function saveCompanySettings(tenantSlug, settings) {
  if (!tenantSlug) return;
  localStorage.setItem(`bk_settings_${tenantSlug}`, JSON.stringify(settings));
}
