import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { OrderService } from '../../services/order.service';


// ============================================================
// ORDER ITEM
// ============================================================

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


// ============================================================
// ORDER
// ============================================================

export interface Order {
  id: number;

  clientId: number;

  clientName: string;

  phoneNumber: string;

  address: string | null;

  email: string | null;

  orderDate: string;

  status: string;

  totalAmount: number;

  items: OrderItem[];
}


// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-orders',

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],

  templateUrl: './orders.html',

  styleUrl: './orders.scss'
})
export class Orders implements OnInit {

  private readonly orderService = inject(OrderService);

  private readonly cdr = inject(ChangeDetectorRef);


  // ============================================================
  // DATA
  // ============================================================

  orders: Order[] = [];

  loading = false;

  errorMessage = '';

  expandedOrderId: number | null = null;


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ============================================================
  // LOAD ORDERS
  // ============================================================

  loadOrders(): void {

    console.log('================================');
    console.log('Loading orders...');
    console.log('================================');

    this.loading = true;

    this.errorMessage = '';

    // Force UI to show loading
    this.cdr.detectChanges();


    this.orderService.getOrders().subscribe({

      // ========================================================
      // SUCCESS
      // ========================================================

      next: (response: Order[]) => {

        console.log('================================');
        console.log('Orders from API:', response);
        console.log('================================');


        this.orders = Array.isArray(response)
          ? response
          : [];


        console.log(
          'Orders count:',
          this.orders.length
        );


        // IMPORTANT
        this.loading = false;


        console.log(
          'Loading after response:',
          this.loading
        );


        // IMPORTANT
        // Force Angular to update the template
        this.cdr.detectChanges();


        console.log(
          'UI should now show orders.'
        );

      },


      // ========================================================
      // ERROR
      // ========================================================

      error: (error) => {

        console.error(
          '================================'
        );

        console.error(
          'Orders API error:',
          error
        );

        console.error(
          '================================'
        );


        this.loading = false;


        this.errorMessage =
          error?.error?.message ||
          error?.message ||
          'Failed to load orders.';


        this.cdr.detectChanges();

      },


      // ========================================================
      // COMPLETE
      // ========================================================

      complete: () => {

        console.log(
          'Orders request completed.'
        );

      }

    });

  }


  // ============================================================
  // EXPAND / COLLAPSE
  // ============================================================

  toggleOrder(orderId: number): void {

    if (this.expandedOrderId === orderId) {

      this.expandedOrderId = null;

    } else {

      this.expandedOrderId = orderId;

    }

  }


  isExpanded(orderId: number): boolean {

    return this.expandedOrderId === orderId;

  }


  // ============================================================
  // UPDATE STATUS
  // ============================================================

  updateStatus(
    order: Order,
    status: string
  ): void {

    if (!status || status === order.status) {
      return;
    }


    const oldStatus = order.status;


    // Optimistic update
    order.status = status;


    this.orderService
      .updateStatus(order.id, status)
      .subscribe({

        next: () => {

          console.log(
            `Order ${order.id} status changed to ${status}`
          );

        },


        error: (error) => {

          console.error(
            'Error updating status:',
            error
          );


          // Restore old status
          order.status = oldStatus;


          this.errorMessage =
            error?.error?.message ||
            'Failed to update order status.';


          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // CANCEL ORDER
  // ============================================================

  cancelOrder(order: Order): void {

    if (
      order.status?.toLowerCase() ===
      'cancelled'
    ) {

      return;

    }


    const confirmed = confirm(
      `Are you sure you want to cancel Order #${order.id}?`
    );


    if (!confirmed) {
      return;
    }


    this.orderService
      .cancelOrder(order.id)
      .subscribe({

        next: () => {

          order.status = 'Cancelled';

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error cancelling order:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Failed to cancel order.';


          this.cdr.detectChanges();

        }

      });

  }


  // ============================================================
  // STATUS CLASS
  // ============================================================

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toLowerCase()
    ) {

      case 'pending':
        return 'status-pending';

      case 'processing':
        return 'status-processing';

      case 'delivered':
        return 'status-delivered';

      case 'completed':
        return 'status-completed';

      case 'cancelled':
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }


  // ============================================================
  // STATISTICS
  // ============================================================

  getTotalOrders(): number {

    return this.orders.length;

  }


  getPendingOrders(): number {

    return this.orders.filter(
      order =>
        order.status?.toLowerCase() ===
        'pending'
    ).length;

  }


  getTotalSales(): number {

    return this.orders

      .filter(
        order =>
          order.status?.toLowerCase() !==
          'cancelled'
      )

      .reduce(
        (total, order) =>
          total +
          Number(
            order.totalAmount || 0
          ),
        0
      );

  }


  // ============================================================
  // ITEMS COUNT
  // ============================================================

  getItemsCount(
    order: Order
  ): number {

    if (
      !order.items ||
      order.items.length === 0
    ) {

      return 0;

    }


    return order.items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  }


  // ============================================================
  // IMAGE URL
  // ============================================================

  getImageUrl(
    imageUrl: string | null
  ): string {

    if (!imageUrl) {

      return '';

    }


    if (
      imageUrl.startsWith('http')
    ) {

      return imageUrl;

    }


    return `https://localhost:7256${imageUrl}`;

  }


  // ============================================================
  // TRACK BY
  // ============================================================

  trackByOrderId(
    index: number,
    order: Order
  ): number {

    return order.id;

  }

}