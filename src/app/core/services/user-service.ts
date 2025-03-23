import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recruiter, Seeker, Admin } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode' ;
import { RecruiterProfile } from '../models/profile-details.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = `${environment.apiUrl}`; // Automatically selects correct URL

  private role = localStorage.getItem('userRole') || '';
  private userData = JSON.parse(localStorage.getItem('userData') || '{}');

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // const token = localStorage.getItem('token');

const token = localStorage.getItem('JWT_Token');
if (token) {
  const decodedToken: any = jwtDecode(token);
  console.log('Decoded Token:', decodedToken);
  console.log('Expiration Date:', new Date(decodedToken.exp * 1000));  // exp is in seconds
}

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders(); // Return empty headers to avoid undefined errors
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: any): Observable<never> {
    console.error('🔥 API Error:', error);
    if (error.status === 401) {
      alert('❌ Unauthorized! Please log in again.');
      localStorage.clear();
      window.location.href = '/login';
    }
    return throwError(() => new Error(error.message || 'API Error'));
  }


  private validateUserData() {
    if (!this.userData || !this.userData._id) {
      console.error('🚨 Invalid user data in localStorage!');
      return false;
    }
    return true;
  }


  getRecruiterById(id: string): Observable<Recruiter> {
      if (this.role === 'recruiter' && this.userData._id === id) {
      return of(this.userData);  // Use 'of' for synchronous response
    } else {
      return this.http.get<Recruiter>(`${this.baseUrl}/recruiter/${id}`, { headers: this.getHeaders() })
        .pipe(catchError(error => this.handleError(error)));
    }
  }

  getAllRecruiters(): Observable<{ totalRecruiters: number; recruiters: Recruiter[] }> {
    return this.http.get<{ totalRecruiters: number; recruiters: Recruiter[] }>(`${this.baseUrl}/recruiters`, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }


  getSeekerById(id: string): Observable<Seeker> {
    if (this.role === 'seeker' && this.userData._id === id) {
      return of(this.userData);  // Use 'of' for synchronous response
    } else {
      return this.http.get<Seeker>(`${this.baseUrl}/seeker/${id}`, { headers: this.getHeaders() })
        .pipe(catchError(error => this.handleError(error)));
    }
  }

  getAllSeekers(): Observable<{ totalSeekers: number; seekers: Seeker[] }> {
    return this.http.get<{ totalSeekers: number; seekers: Seeker[]  }>(`${this.baseUrl}/seekers`, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }

  getUserDetails(id: string): Observable<any> {
    console.log("Role in localStorage:", this.role);
    if (!this.validateUserData()) {
      return throwError(() => new Error('User data is invalid or missing.'));
    }
    switch(this.role) {
      case 'recruiter':
        return this.getRecruiterById(id);
      case 'seeker':
        return this.getSeekerById(id);
      default:
        console.error('🚨 Invalid role');
        return throwError(() => new Error('Invalid role'));
    }
  }


  deleteRecruiterById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/recruiter/${id}/delete`, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }

  deleteSeekerById(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/seeker/${id}/delete`, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }


  getAdminById(id: string): Observable<Admin> {
    if (this.role === 'admin' && this.userData._id === id) {
      return of(this.userData);  // Use 'of' for synchronous response
    } else {
      return this.http.get<Admin>(`${this.baseUrl}/admin/${id}`, { headers: this.getHeaders() })
        .pipe(catchError(error => this.handleError(error)));
    }
  }





}
