import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl + '/contacts';
  
  constructor(private http: HttpClient) {}
  
  getGuestContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/guest`);
  }
  
  getUserContacts(userId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  createContact(contact: Partial<Contact>, profilePicture?: File): Observable<Contact> {
    const formData = new FormData();
    Object.keys(contact).forEach(key => {
      const value = (contact as any)[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (profilePicture) {
      formData.append('profilePicture', profilePicture, profilePicture.name);
    }
    return this.http.post<Contact>(this.apiUrl, formData);
  }
  
  deleteContact(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  editContact(id: string, contact: Partial<Contact>, profilePicture?: File): Observable<Contact> {
    const formData = new FormData();
    Object.keys(contact).forEach(key => {
      const value = (contact as any)[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (profilePicture) {
      formData.append('profilePicture', profilePicture, profilePicture.name);
    }
    return this.http.patch<Contact>(`${this.apiUrl}/${id}`, formData);
  }
}