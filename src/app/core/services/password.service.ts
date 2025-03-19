import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangePassword} from '../models/password.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) {}

  private baseUrl: string = `${environment.apiUrl}/auth`; // Automatically selects correct URL

  private role = localStorage.getItem('userRole') || '';
  private userData = JSON.parse(localStorage.getItem('userData') || '{}');

  isLoggedIn(): boolean {
    return !!localStorage.getItem('JWT_Token');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Function to change password for recruiter
  changeRecruiterPassword(id: string, passwordModel:ChangePassword): Observable<any> {
    return this.http.patch(`${this.baseUrl}/recruiter/${id}/change-password`, passwordModel , { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }

  // Function to change password for seeker
  changeSeekerPassword(id: string, passwordModel:ChangePassword): Observable<any> {
    return this.http.patch(`${this.baseUrl}/seeker/${id}/change-password`,  passwordModel , { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: any): Observable<never> {
    console.error('🔥 API Error:', error);
    if (error.status === 401) {
      alert('❌ Unauthorized! Please log in again.');
      localStorage.clear();
      window.location.href = 'talent-page/login';
    }
    return throwError(() => new Error(error.message || 'API Error'));
  }
}
