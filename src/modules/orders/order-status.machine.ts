export const ORDER_STATUS_TRANSITIONS = {
  PENDING: ['ACCEPT', 'CANCEL', 'REJECT'],
  ACCEPT: ['PREPARE', 'CANCEL', 'REJECT'],
  PREPARE: ['SENDING', 'CANCEL', 'REJECT'],
  SENDING: ['RECEIVE', 'CANCEL'],
  RECEIVE: [],
  CANCEL: [],
  REJECT: [],
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_TRANSITIONS;

export const ORDER_STATUSES: OrderStatus[] = Object.keys(ORDER_STATUS_TRANSITIONS) as OrderStatus[];

export function canTransition(current: string, next: string): boolean {
  if (!current || !next) return false;
  const allowed = ORDER_STATUS_TRANSITIONS[current as OrderStatus];
  return Array.isArray(allowed) && allowed.includes(next as OrderStatus);
}
