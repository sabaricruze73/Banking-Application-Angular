import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  Name: string = '';
  NickName: string = '';
  DateofBirth: string = '';
  Aadhaar: string = '';
  PanNumber: string = '';
  Number: string = '';
  Address: string = '';
  AccountType: string = '';
  InitialBalance: string = '';
  NomineeName: string = '';
  Username: string = '';
  Password: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient) {}

  signup() {
    const data = new HttpParams()
      .set('Name', this.Name)
      .set('NickName', this.NickName)
      .set('DateofBirth', this.DateofBirth)
      .set('Aadhaar', this.Aadhaar)
      .set('PanNumber', this.PanNumber)
      .set('Number', this.Number)
      .set('Address', this.Address)
      .set('AccountType', this.AccountType)
      .set('InitialBalance', this.InitialBalance)
      .set('NomineeName', this.NomineeName)
      .set('Username', this.Username)
      .set('Password', this.Password);

    this.http
      .post('http://localhost:8080/BankingZoho/html/User', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .subscribe(
        (response: any) => {
          this.responseMessage = response.data;
        },
        (error) => {
          console.error('Error during POST request:', error);
          this.responseMessage =
            'An error occurred while updating the details.';
        }
      );
  }
}
