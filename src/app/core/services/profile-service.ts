import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Company } from '../models/company.model';
import { RecruiterProfile, SeekerProfile } from '../models/profile-details.model';
import { environment } from 'src/environments/environment';
import { Seeker, SeekerData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl: string = `${environment.apiUrl}`; // Automatically selects correct URL

  private role = localStorage.getItem('userRole') || '';
  private userData = JSON.parse(localStorage.getItem('userData') || '{}');

  private getHeaders(): HttpHeaders {
const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders(); // Return empty headers to avoid undefined errors
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  companyList: Company[] = [];

  constructor(private http: HttpClient) { }


  getRecruiterProfileById(recruiterId: string): Observable<RecruiterProfile> {
    if (this.role === 'recruiter' && this.userData._id === recruiterId) {
      return of(this.userData);  // Return locally stored data if same user
    } else {
      return this.http.get<RecruiterProfile>(`${this.baseUrl}/recruiter/${recruiterId}/profile-details`, { headers: this.getHeaders() })
        .pipe(catchError(error => this.handleError(error)));
    }
  }

    getAllRecruiters(): Observable<{ totalRecruiters: number; recruiters: RecruiterProfile[] }> {
      return this.http.get<{ totalRecruiters: number; recruiters: RecruiterProfile[] }>(`${this.baseUrl}/recruiters`, { headers: this.getHeaders() })
        .pipe(catchError(error => this.handleError(error)));
    }



  // ✅ Create Recruiter Profile
  postRecruiterProfile(profileData: RecruiterProfile): Observable<RecruiterProfile> {
    return this.http.post<RecruiterProfile>(`${this.baseUrl}/recruiter/profile-details`, profileData, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }

  // ✅ Update Recruiter Profile
  updateRecruiterProfile(recruiterId:string,updatedData: RecruiterProfile): Observable<RecruiterProfile> {
    return this.http.put<RecruiterProfile>(`${this.baseUrl}/recruiter/${recruiterId}/profile-details`, updatedData, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
}



getSeekerProfileById(seekerId:string): Observable<SeekerProfile> {
  if (this.role === 'seeker' && this.userData._id === seekerId) {
    // Return locally stored data if it's the same user
    return of(this.userData);
  } else {
    // Otherwise, make an HTTP GET request
    return this.http.get<SeekerProfile>(`${this.baseUrl}/seeker/${seekerId}/profile-details`, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error)));
  }
}


getSeekerDataById(recruiterId: string, seekerId: string): Observable<SeekerData> { // Fix parameter order
  return this.http.get<SeekerData>(
    `${this.baseUrl}/recruiter/${recruiterId}/seekerData/${seekerId}/profileData`, // Ensure URL matches backend
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}



getSeekerData(recruiterId: string): Observable<{ recruiterId: string, totalSeekers: number; seekers: SeekerData[] }> {
  return this.http.get<{ recruiterId: string, totalSeekers: number; seekers: SeekerData[] }>(
    `${this.baseUrl}/recruiter/${recruiterId}/seekerData`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => this.handleError(error))
  );
}



// ✅ Create Recruiter Profile
postSeekerProfile(profileData: SeekerProfile): Observable<SeekerProfile> {
  return this.http.post<SeekerProfile>(`${this.baseUrl}/seeker/profile-details`, profileData, { headers: this.getHeaders() })
    .pipe(catchError(error => this.handleError(error)));
}

// ✅ Update Recruiter Profile
updateSeekerProfile(seekerId:string, updatedData: SeekerProfile): Observable<SeekerProfile> {
  return this.http.put<SeekerProfile>(`${this.baseUrl}/seeker/${seekerId}/profile-details`, updatedData, { headers: this.getHeaders() })
    .pipe(catchError(error => this.handleError(error)));
}




  // Handle HTTP errors
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
