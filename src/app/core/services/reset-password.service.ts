import { Injectable } from '@angular/core';
import { Observable, throwError, of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) {}

  private baseUrl: string = `${environment.apiUrl}/auth`; // Automatically selects correct URL


  sendForgotPasswordCode(email: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/forgot-password-code`, { email })
      .pipe(catchError(error => {
        throw error;
      }));
  }

  verifyForgotPasswordCode(providedCode: string, email: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/verify-forgotPassword-code`,  {
      email,
      providedCode
    })
    .pipe(catchError(error => this.handleError(error)));
  }


   // Function to resend OTP to the user's email
 resendOtp(email: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/forgot-password-code`, { email })
  .pipe(catchError(error => this.handleError(error)));
}


  resetPassword(email: string,  newPassword: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/reset-password`, {
      email,
      newPassword
    })
    .pipe(catchError(error => this.handleError(error)));

  }

  private handleError(error: any): Observable<never> {
    console.error('🔥 API Error:', error);
    if (error.status === 401) {
      alert('❌ Unauthorized! Please log in again.');
      localStorage.clear();
      window.location.href = 'app/login';
    }
    return throwError(() => new Error(error.message || 'API Error'));
  }
}
