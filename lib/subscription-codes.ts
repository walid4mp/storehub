import 'server-only'

export const SUBSCRIPTION_CODES = {
  standard: [
    'STD-9K2M-ALFA',
    'STD-4P7X-NOVA',
    'STD-8T3Q-MARK',
    'STD-6L1W-SHOP',
    'STD-5R8Z-PLUS',
  ],
  pro: [
    'PRO-7V2N-ELIT',
    'PRO-3Q9K-MAXX',
    'PRO-8M4T-GOLD',
    'PRO-6X1P-ULTR',
    'PRO-5Z7R-PRME',
  ],
} as const

export type PaidPlan = keyof typeof SUBSCRIPTION_CODES

export function normalizeSubscriptionCode(code: string) {
  return code.trim().toUpperCase()
}

export function isValidSubscriptionCode(plan: PaidPlan, code: string) {
  return SUBSCRIPTION_CODES[plan].includes(normalizeSubscriptionCode(code) as never)
}
