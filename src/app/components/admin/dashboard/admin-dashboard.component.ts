import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
interface MonthlySale {
  month: string;
  value: number;
}

interface RecentSale {
  product: string;
  quantity: number;
  amount: number;
  date: Date;
}
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
       MatListModule, 
       MatIconModule, 
       MatToolbarModule,
       MatButtonModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})

export class AdminDashboardComponent {
  currentDate = new Date();

  totalSales = 128;

  totalRevenue = 45650;

  /**
   * Partner gets 30% of total sales
   */
  partnerShare = (this.totalRevenue * 0.30).toFixed(2);

  /**
   * You get the remaining 70%
   */
  yourShare =( this.totalRevenue * 0.70).toFixed(2);


  monthlySales: MonthlySale[] = [
    { month: 'Jan', value: 3200 },
    { month: 'Feb', value: 4100 },
    { month: 'Mar', value: 3800 },
    { month: 'Apr', value: 5200 },
    { month: 'May', value: 4600 },
    { month: 'Jun', value: 6100 },
    { month: 'Jul', value: 5800 },
    { month: 'Aug', value: 7450 }
  ];


  recentSales: RecentSale[] = [
    {
      product: 'Luxury Face Cream',
      quantity: 2,
      amount: 850,
      date: new Date()
    },
    {
      product: 'Golden Perfume',
      quantity: 1,
      amount: 1200,
      date: new Date()
    },
    {
      product: 'Skin Care Set',
      quantity: 3,
      amount: 2100,
      date: new Date()
    },
    {
      product: 'Lipstick Collection',
      quantity: 2,
      amount: 700,
      date: new Date()
    }
  ];


  getBarHeight(value: number): number {

    const max = Math.max(
      ...this.monthlySales.map(x => x.value)
    );

    return (value / max) * 100;
  }
}
