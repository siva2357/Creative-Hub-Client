import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode' ;
import { University } from '../models/university.model';
import { Company } from '../models/company.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string = `${environment.apiUrl}`; // Automatically selects correct URL

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
    }
    if (!token) {
      console.error('🚨 No token found in localStorage!');
      return new HttpHeaders(); // Return empty headers to avoid undefined errors
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  universityList: University[] = [];

  constructor(private http: HttpClient) {}

  // Create a new job post
  createUniversity(universityData: University): Observable<University> {
    return this.http
      .post<University>(`${this.baseUrl}/admin/university`, universityData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getAllUniversities(): Observable<{
    totalUniversities: number;
    universities: University[];
  }> {
    return this.http
      .get<{ totalUniversities: number; universities: University[] }>(
        `${this.baseUrl}/universities`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getUniversityById(id: string): Observable<University> {
    return this.http
      .get<University>(`${this.baseUrl}/university/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateUniversityById(
    id: string,
    universityData: University
  ): Observable<University> {
    return this.http
      .put<University>(
        `${this.baseUrl}/admin/university/${id}`,
        universityData,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  deleteUniversityById(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/admin/university/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  createCompany(companyData: Company): Observable<Company> {
    return this.http
      .post<Company>(`${this.baseUrl}/admin/company`, companyData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getAllCompanies(): Observable<{
    totalCompanies: number;
    companies: Company[];
  }> {
    return this.http
      .get<{ totalCompanies: number; companies: Company[] }>(
        `${this.baseUrl}/companies`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getCompanyById(id: string): Observable<Company> {
    return this.http
      .get<Company>(`${this.baseUrl}/company/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateCompanyById(id: string, companyData: Company): Observable<Company> {
    return this.http
      .put<Company>(`${this.baseUrl}/admin/company/${id}`, companyData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteCompanyById(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/admin/company/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
