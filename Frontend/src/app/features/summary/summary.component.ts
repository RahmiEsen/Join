import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})

export class SummaryComponent implements OnInit {
  role: string = 'unbekannt';
  name: string = 'Unbekannt';

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      this.role = payload.role || 'unbekannt';
      this.name = payload.name || 'Unbekannt';
    }
  }
}
