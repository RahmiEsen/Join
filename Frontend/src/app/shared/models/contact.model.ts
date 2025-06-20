export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export function getInitials(firstName: string, lastName: string): string {
    return (firstName[0] + lastName[0]).toUpperCase();
}