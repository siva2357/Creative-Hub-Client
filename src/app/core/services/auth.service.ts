

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { Login, LoginResponse } from '../models/auth.model';
import { Recruiter, Seeker } from '../models/user.model';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode' ;
import { getAuth, signInWithCustomToken } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'http://localhost:3000/api/auth';
  private userRole: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('JWT_Token')}`,
      'Content-Type': 'application/json'
    });
  }


  // Register recruiter and send OTP code
registerRecruiter(recruiterData: Recruiter): Observable<any> {
  return this.http.post(`${this.baseUrl}/recruiter/signup`, recruiterData)
    .pipe(
      switchMap((response: any) => {
        // After successful registration, send OTP verification code
        return this.sendVerificationCode(recruiterData.registrationDetails.email);
      }),
      catchError(error => this.handleError(error))
    );
}


    // Register recruiter and send OTP code
registerSeeker(seekerData: Seeker): Observable<any> {
  return this.http.post(`${this.baseUrl}/seeker/signup`, seekerData)
    .pipe(
      switchMap((response: any) => {
        // After successful registration, send OTP verification code
        return this.sendVerificationCode(seekerData.registrationDetails.email);
      }),
      catchError(error => this.handleError(error))
    );
}


login(loginData: Login): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/login/user`, loginData)
    .pipe(
      tap(response => {
        if (response && response.role && response.token !== undefined) {
          if (this.isTokenExpired(response.token)) {
            window.alert('Session expired, please log in again.');
            this.logout();
          } else {
            this.setUserData(response);
            localStorage.setItem('userId', response.userId);
            console.log("Token Set in LocalStorage:", response.token); // Check token

            localStorage.setItem('JWT_Token', response.token);
          }
        } else {
          throw new Error('Invalid login response');
        }
      }),
      catchError(error => {
        console.error('Login Error:', error);
        window.alert('Invalid credentials');
        return throwError(() => new Error(error));
      })
    );
}

isTokenExpired(token: string): boolean {
  const decoded: any = this.decodeJwt(token);
  const expTime = decoded?.exp * 1000;
  return Date.now() > expTime;
}

decodeJwt(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

logout() {
  const token = localStorage.getItem('JWT_Token'); // Retrieve token from localStorage

  if (!token) {
    console.error("No token found. User may already be logged out.");
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  this.http.post(`${this.baseUrl}/logout/user`, {}, { headers, withCredentials: true }).subscribe(
    (response: any) => {
      console.log(response.message);

      // Clear local storage
      localStorage.removeItem('userData');
      localStorage.removeItem('JWT_Token');
      localStorage.removeItem('Authorization');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');

      this.userRole = null;

      // Redirect to login page
      this.router.navigate(['talent-page/login']);
    },
    (error) => {
      console.error('Logout failed', error);
    }
  );
}



// Set user data (when login succeeds)
private setUserData(user: LoginResponse) {
  console.log('Setting complete user data:', user);
  if (user && user.token) {
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('JWT_Token', user.token);
    localStorage.setItem('Authorization', user.token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.userId);
  } else {
    console.log('Invalid user data:', user);
  }
}

// Error handling
private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  window.alert('An unexpected error occurred. Please try again.');
  return throwError(() => new Error('Something went wrong; please try again later.'));
}




  // Send verification code
sendVerificationCode(email: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/send-verification-code`, { email })
    .pipe(catchError(error => this.handleError(error)));
}


verifyOtp(providedCode: string, email: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/verify-verification-code`, {
      email,
      providedCode
    })
    .pipe(
      catchError((error) => {
        console.error('Error verifying OTP:', error);
        throw error; // Pass error back to the frontend
      })
    );
}

 // Function to resend OTP to the user's email
 resendOtp(email: string): Observable<any> {
  return this.http.patch(`${this.baseUrl}/send-verification-code`, { email })
    .pipe(catchError(error => this.handleError(error)));
}






  // Get stored token
  getToken(): string | null {
    const token = localStorage.getItem('JWT_Token');  // Use the correct token name
    if (token) {
      const decodedToken: any = jwtDecode(token);  // Decode the JWT token to inspect it
      console.log('Decoded Token:', decodedToken);
      console.log('Expiration Date:', new Date(decodedToken.exp * 1000));  // exp is in seconds
    }
    return token;  // Return the token after checking if it exists
  }





  setUserRole(role: string) {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  getUserData(): any {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    console.log('Fetched user data:', user);
    return user || null;
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('userData');
  }

  getUserName(): string | null {
    const user = this.getUserData();
    return user?.userName || null;  // Assuming 'userName' is stored in 'registrationDetails'
  }
  getRole(): string | null {
    const user = this.getUserData();
    return user?.role || null;
  }

  getUserId(): string | null {
    const user = this.getUserData();
    return user?._id || null;
  }








}

