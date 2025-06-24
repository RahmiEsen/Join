import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { CreateContactDto } from '../models/contact.dto';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';
  
  constructor(private http: HttpClient) {}
  
  getGuestContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/guest`);
  }
  
  getUserContacts(userId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  createContact(contact: CreateContactDto): Observable<Contact> {
    const payload = { ...contact };
    if (!payload.ownerId) delete payload.ownerId;
    return this.http.post<Contact>(this.apiUrl, payload);
  }

  deleteContact(id: string) {
    return this.http.delete(`http://localhost:3000/contacts/${id}`);
  }
}