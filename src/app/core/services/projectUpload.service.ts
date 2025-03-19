import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode' ;
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectUpload,ProjectResponse } from '../models/project-upload.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProjectUploadService {

    private baseUrl: string = `${environment.apiUrl}/api`; // Automatically selects correct URL

  projectList: ProjectUpload[] = [];

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

  // Create a new job post
  createProjectUpload(projectUploadData: ProjectUpload): Observable<ProjectUpload> {
    return this.http.post<ProjectUpload>(`${this.baseUrl}/seeker/project`,projectUploadData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

    // Fetch all job posts for recruiter
  getProjects(seekerId:string,): Observable<{totalProjects: number;  projects: ProjectUpload[]}> {
      return this.http.get<{totalProjects: number;  projects: ProjectUpload[] }>(`${this.baseUrl}/seeker/${seekerId}/projects`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
    }

    // Fetch job post by ID for recruiter
    getProjectById(seekerId:string, projectId: string): Observable<ProjectUpload> {
    return this.http.get<ProjectUpload>(`${this.baseUrl}/seeker/${seekerId}/project/${projectId}`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }


  // Update job post by ID for recruiter
  updateProjectById(seekerId:string,projectId: string, projectUploadData: ProjectUpload): Observable<ProjectUpload> {
    return this.http.put<ProjectUpload>(`${this.baseUrl}/seeker/${seekerId}/project/${projectId}/update`, projectUploadData, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
  }

  // Delete job post by ID for recruiter
  deleteProjectById(seekerId:string,projectId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/seeker/${seekerId}/project/${projectId}/delete`, { headers: this.getHeaders() }).pipe(catchError(this.handleError));
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
