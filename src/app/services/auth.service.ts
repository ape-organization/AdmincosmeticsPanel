import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiBaseUrl+'/users';
  
  private tokenKey = 'pharmacy_token';
  private refreshTokenKey = 'pharmacy_refresh_token';
  private isRefreshingToken$ = new BehaviorSubject<boolean>(false);
  
  //isLoggedIn = signal<boolean>(false);
isLoggedIn = signal<boolean>(this.hasToken());
private hasToken(): boolean {
  return !!localStorage.getItem(this.tokenKey);
}
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          if (response.refreshToken) {
            localStorage.setItem(this.refreshTokenKey, response.refreshToken);
          }
          this.isLoggedIn.set(true);
        } else {
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  refreshToken(): Observable<any> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.logout();
      throw new Error('No tokens available');
    }

    this.isRefreshingToken$.next(true);

    return this.http.post<any>(`${this.apiUrl}/refreshToken`, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }).pipe(
      tap(response => {
        if (response.accessToken || response.token) {
          const newAccessToken = response.accessToken || response.token;
          localStorage.setItem(this.tokenKey, newAccessToken);
          if (response.refreshToken) {
            localStorage.setItem(this.refreshTokenKey, response.refreshToken);
          }
        }
        this.isRefreshingToken$.next(false);
      }),
      catchError(error => {
        this.isRefreshingToken$.next(false);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isRefreshingToken(): boolean {
    return this.isRefreshingToken$.value;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
     
      return payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin' || this.getUserRole() === 'Admin';
  }
}
