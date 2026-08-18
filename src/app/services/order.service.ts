import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../components/orders/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7256/api/orders';


  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      this.apiUrl
    );

  }


  getOrder(id: number): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );

  }


  updateStatus(
    id: number,
    status: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/status`,
      JSON.stringify(status),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  }


  cancelOrder(
    id: number
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/cancel`,
      {}
    );

  }

}