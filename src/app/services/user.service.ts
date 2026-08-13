import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl+'/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<any> {
    return this.http.post<User>(this.apiUrl+'/addUser', user);
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(this.apiUrl+'/editUser', user);
  }

  deleteUser(data: any): Observable<void> {
    return this.http.post<void>(this.apiUrl,data);
  }
}
