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