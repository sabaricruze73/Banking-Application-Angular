import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css'],
})
export class EditDetailsComponent {
  userId: string = '';
  name: string = '';
  dateOfBirth: string = '';
  aadhaar: string = '';
  panNumber: string = '';
  phoneNumber: string = '';
  address: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  updateDetails(): void {
    const data = new HttpParams()
      .set('userId', this.userId)
      .set('name', this.name)
      .set('dateOfBirth', this.dateOfBirth)
      .set('aadhaar', this.aadhaar)
      .set('panNumber', this.panNumber)
      .set('phoneNumber', this.phoneNumber)
      .set('address', this.address);

    this.http
      .post('http://localhost:8080/BankingZoho/html/User?mode=update', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'html' as 'json',
      })
      .subscribe({
        next: (response: any) => {
          this.responseMessage = response;
        },
        error: (error) => {
          console.error('Error during POST request:', error);
          this.responseMessage = 'Enter a valid user id.';
        },
      });
  }
}
