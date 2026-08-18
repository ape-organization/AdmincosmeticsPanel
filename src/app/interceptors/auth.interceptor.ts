import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

import {
  catchError,
  throwError
} from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const authService = inject(AuthService);

  const token =
    authService.getToken();


  // ============================================
  // REFRESH TOKEN REQUEST
  // ============================================

  const isRefreshRequest =
    req.url.includes('/refreshToken');


  // ============================================
  // ADD TOKEN
  // ============================================

  let request = req;

  if (
    token &&
    !isRefreshRequest
  ) {

    request = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`

      }

    });

  }


  // ============================================
  // SEND REQUEST
  // ============================================

  return next(request).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        console.error(
          'HTTP ERROR:',
          request.url,
          error.status
        );


        // ======================================
        // UNAUTHORIZED
        // ======================================

        if (
          error.status === 401 &&
          !isRefreshRequest
        ) {

          console.log(
            '🔴 Unauthorized request'
          );

          /*
           * For now DON'T automatically
           * refresh the token.
           *
           * This is important while we
           * debug the logout/login issue.
           */

          authService.logout();

        }


        return throwError(
          () => error
        );

      }
    )

  );

};