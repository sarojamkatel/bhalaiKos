export function getCustomerAccounts(tenant) {
  try { return JSON.parse(localStorage.getItem(`bk_cust_${tenant}_accounts`) || "{}"); }
  catch { return {}; }
}

export function getCurrentCustomer(tenant) {
  const phone = localStorage.getItem(`bk_cust_${tenant}_current`);
  if (!phone) return null;
  const accounts = getCustomerAccounts(tenant);
  return accounts[phone] ? { ...accounts[phone], phone } : null;
}

export function saveCustomerAccount(tenant, data) {
  const accounts = getCustomerAccounts(tenant);
  accounts[data.phone] = data;
  localStorage.setItem(`bk_cust_${tenant}_accounts`, JSON.stringify(accounts));
}

export function setCurrentCustomer(tenant, phone) {
  localStorage.setItem(`bk_cust_${tenant}_current`, phone);
}

export function logoutCustomer(tenant) {
  localStorage.removeItem(`bk_cust_${tenant}_current`);
}

export function getCustomerRegistrations(tenant, phone) {
  try { return JSON.parse(localStorage.getItem(`bk_cust_${tenant}_regs_${phone}`) || "[]"); }
  catch { return []; }
}

export function saveCustomerRegistration(tenant, phone, reg) {
  const regs = getCustomerRegistrations(tenant, phone);
  regs.unshift(reg);
  localStorage.setItem(`bk_cust_${tenant}_regs_${phone}`, JSON.stringify(regs));
}
