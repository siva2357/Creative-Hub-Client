import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode' ;


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('JWT_Token');

        if (token && this.isTokenExpired(token)) {
            console.warn('Token expired. Redirecting to login...');
            
            localStorage.removeItem('JWT_Token'); // Clear expired token
            this.router.navigate(['/login']);
            return throwError(() => new Error('Token expired, please login again'));
        }

        if (token) {
            const clonedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            return next.handle(clonedRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                        console.warn('Unauthorized request. Redirecting to login...');
                        localStorage.removeItem('JWT_Token');
                        this.router.navigate(['/login']);
                    }
                    return throwError(() => error);
                })
            );
        }

        return next.handle(req);
    }

    // ✅ Check if token is expired before using it
    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
            return decoded.exp < currentTime; // Token expired
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Treat as expired if decoding fails
        }
    }
}
