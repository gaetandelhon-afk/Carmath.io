export function monthlyRateFromAPR(apr: number): number {
  return apr / 100 / 12;
}

export function amortize({
  principal,
  apr,
  months,
  extraPayment = 0,
}: {
  principal: number;
  apr: number;
  months: number;
  extraPayment?: number;
}) {
  const r = monthlyRateFromAPR(apr);
  const payment = r === 0
    ? principal / months
    : (principal * r) / (1 - Math.pow(1 + r, -months));

  let balance = principal;
  let month = 0;
  const schedule: Array<{month: number; payment: number; interest: number; principalPaid: number; balance: number;}> = [];
  let totalInterest = 0;

  while (balance > 0 && month < 6000) {
    month++;
    const interest = balance * r;
    let principalPaid = payment - interest + extraPayment;
    if (principalPaid > balance) principalPaid = balance;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      month,
      payment: principalPaid + interest,
      interest,
      principalPaid,
      balance,
    });
    if (r === 0 && month >= months) break;
  }

  const payoffMonths = schedule.length;
  const totalPaid = schedule.reduce((s, x) => s + x.payment, 0);

  return {
    payment,
    payoffMonths,
    totalInterest,
    totalPaid,
    schedule,
  };
}
