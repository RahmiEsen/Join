export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  color?: string;
  isGuest: boolean;
  ownerId: string;
}

export type NewContact = Omit<Contact, 'id'>;

export function getInitials(firstName: string, lastName?: string): string {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (!fullName) return '?';
  const parts = fullName.split(' ').filter(Boolean);
  const firstInitial = parts[0]?.[0]?.toUpperCase() || '';
  const lastInitial = parts.length > 1
    ? parts[parts.length - 1][0]?.toUpperCase()
    : '';
  return (firstInitial + lastInitial) || '?';
}