export interface CreateContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isGuest: boolean;
  ownerId?: string;
}