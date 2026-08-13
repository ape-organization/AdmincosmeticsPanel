import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-base-layout',
  imports: [ CommonModule, 
    RouterModule, 
    MatSidenavModule, 
    MatListModule, 
    MatIconModule, 
    MatToolbarModule,
    MatButtonModule],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.scss',
})
export class BaseLayout {

  protected readonly title = signal('Cosmetics'); 
  private readonly breakpointObserver = inject(BreakpointObserver); 
  readonly cartService = inject(CartService); 
  readonly authService = inject(AuthService); 
  readonly isLoggedIn = this.authService.isLoggedIn;
   readonly isMobile = toSignal( this.breakpointObserver .observe([Breakpoints.Handset]) 
   .pipe( map(result => result.matches) ),
    { initialValue: false } );
     closeMobileDrawer(drawer: any): void
      { if (this.isMobile()) { drawer.close(); } }
       logout(drawer: any): void 
       { this.authService.logout(); if (this.isMobile()) 
        { drawer.close(); } } 
}
