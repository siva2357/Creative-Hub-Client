import { Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode' ;
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobPost, JobPostFilterParams } from '../models/jobPost.model';
import { ApiSearchParams } from '../models/api-pagination-params';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  private baseUrl: string = 'http://localhost:3000/api';

  jobList: JobPost[] = [];

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('JWT_Token');

    if (!token) {
      console.error("🚨 No token found in localStorage!");
      return new HttpHeaders(); // Empty headers to avoid undefined errors
    }

    // Debugging: Decode and check token expiration
    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      console.log('Expiration Date:', new Date(decodedToken.exp * 1000));  // `exp` is in seconds
    } catch (error) {
      console.error("🚨 Token decoding failed:", error);
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // ✅ Correct token format
      'Content-Type': 'application/json'
    });
  }



  constructor(private http: HttpClient) { }

//Recruiter actions for job Posts
  createJobPost(jobPostData: JobPost): Observable<JobPost> {
    return this.http.post<JobPost>(`${this.baseUrl}/recruiter/jobPost`, jobPostData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  getJobsByRecruiter(recruiterId:string,): Observable<{totalJobPosts: number;  jobPosts: JobPost[]}> {
      return this.http.get<{totalJobPosts: number;  jobPosts: JobPost[] }>(`${this.baseUrl}/recruiter/${recruiterId}/jobPosts`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
    }

  getRecruiterJobPostById(recruiterId:string, jobId: string): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/recruiter/${recruiterId}/jobPost/${jobId}`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  getClosedJobsByRecruiter(recruiterId:string, apiFilterParams?: ApiSearchParams): Observable<{totalJobPosts: number;  jobPosts: JobPost[]}> {
    return this.http.get<{totalJobPosts: number;  jobPosts: JobPost[] }>(`${this.baseUrl}/recruiter/${recruiterId}/jobPosts/closed`, {  headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  // getClosedJobsByRecruiter(recruiterId: string, apiFilterParams?: JobPostFilterParams): Observable<{ totalJobPosts: number; jobPosts: JobPost[] }> {
  //   let params = new HttpParams();

  //   // Add query parameters for pagination and search
  //   if (apiFilterParams) {
  //     params = params.set('pageNumber', apiFilterParams.pageNumber.toString())
  //                    .set('limit', apiFilterParams.limit.toString())
  //                    .set('searchString', apiFilterParams.searchString || '');  // Ensure searchString is included if set
  //   }

  //   return this.http.get<{ totalJobPosts: number; jobPosts: JobPost[] }>(
  //     `${this.baseUrl}/recruiter/${recruiterId}/jobPosts/closed`,
  //     { headers: this.getHeaders(), params: params }
  //   ).pipe(catchError(this.handleError));
  // }





  updateJobPostById(recruiterId:string,jobId: string, jobPostData: JobPost): Observable<JobPost> {
    return this.http.put<JobPost>(`${this.baseUrl}/recruiter/${recruiterId}/jobPost/${jobId}/update`, jobPostData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  deleteJobPostById(recruiterId:string,jobId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/recruiter/${recruiterId}/jobPost/${jobId}/delete`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }


  closeJobPostById(recruiterId:string, jobId: string,jobPostData: JobPost): Observable<JobPost> {
    return this.http.put<JobPost>(`${this.baseUrl}/recruiter/${recruiterId}/jobPost/${jobId}/close`, jobPostData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  reopenJobPostById(recruiterId:string,jobId: string, jobPostData: JobPost): Observable<JobPost> {
    return this.http.put<JobPost>(`${this.baseUrl}/recruiter/${recruiterId}/jobPost/${jobId}/reopen`, jobPostData,  { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }


  getJobApplicants(recruiterId:string,jobPostId: string): Observable<any> {
    return this.http.get<JobPost[]>(`${this.baseUrl}/recruiter/${recruiterId}/jobpost/${jobPostId}/applicants`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }


  getRecruiterJobApplicants(recruiterId:string): Observable<{totalJobPosts: number;  jobPosts: JobPost[], totalApplicants:number}> {
    return this.http.get<{totalJobPosts: number; totalApplicants: number; jobPosts: JobPost[] }>(`${this.baseUrl}/recruiter/${recruiterId}/jobPosts/Applicants`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }




// Seeker actions for job Posts
  getAllJobPosts(): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.baseUrl}/seeker/jobPosts`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  getJobPostById(jobId: string): Observable<JobPost> {
    return this.http.get<JobPost>(`${this.baseUrl}/seeker/jobPosts/${jobId}`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  applyJobPostById(seekerId:string, jobId: string, jobPostData: JobPost): Observable<JobPost> {
    return this.http.post<JobPost>(`${this.baseUrl}/seeker/${seekerId}/job-post/${jobId}/apply`, jobPostData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  getAppliedJobPosts(seekerId:string): Observable<JobPost[]> {
    return this.http.get<JobPost[]>(`${this.baseUrl}/seeker/${seekerId}/applied-jobs`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  withdrawJobPostById(seekerId:string, jobId: string, jobPostData: JobPost): Observable<JobPost> {
    return this.http.post<JobPost>(`${this.baseUrl}/seeker/${seekerId}/job-post/${jobId}/withdraw`,jobPostData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
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
