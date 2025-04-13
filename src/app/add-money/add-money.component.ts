import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.css'],
})
export class AddMoneyComponent {
  accountNumber: string = '';
  amount: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    const data = new HttpParams()
      .set('accountNumber', this.accountNumber)
      .set('amount', this.amount);
    this.http
      .post('http://localhost:8080/BankingZoho/html/Account', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'html' as 'json',
      })
      .subscribe(
        (response: any) => {
          this.responseMessage = response;
        },
        (error) => {
          console.error('Error during POST request:', error);
          this.responseMessage = 'An error occurred during submission.';
        }
      );
  }
}
