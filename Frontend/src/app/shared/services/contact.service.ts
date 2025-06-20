import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

@Injectable({
  providedIn: 'root',
})

export class ContactService {
    constructor(private http: HttpClient) {}
    
    getGuestContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>('http://localhost:3000/contacts/guest');
    }
}