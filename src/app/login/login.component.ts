import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  userNameChange: string = '';
  responseMessage: string = '';
  showForgetPasswordDiv: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  async submitForm(): Promise<void> {
    const formData = new HttpParams()
      .set('userName', this.userName)
      .set('password', this.password);

    try {
      const response: any = await this.http
        .post('http://localhost:8080/BankingZoho/html/Login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          observe: 'response',
        })
        .toPromise();

      if (response.body?.redirectUrl) {
        this.router.navigate([response.body.redirectUrl]);
      } else {
        this.responseMessage = response.body?.message || 'Login successful!';
      }
    } catch (error) {
      console.error('Error during POST request:', error);
      this.responseMessage = 'An error occurred while logging in.';
    }
  }

  triggerPasswordResetRequest(): void {
    this.showForgetPasswordDiv = true;
  }

  async changePasswordRequest(): Promise<void> {
    const formData = new HttpParams().set(
      'userNameChange',
      this.userNameChange
    );

    try {
      const response: any = await this.http
        .post(
          'http://localhost:8080/BankingZoho/html/User?mode=resetRequest',
          formData,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        .toPromise();
      this.responseMessage =
        response?.message || 'Password reset request sent.';
    } catch (error) {
      console.error('Error during POST request:', error);
      this.responseMessage =
        'An error occurred while sending the password reset request.';
    }
  }
}
