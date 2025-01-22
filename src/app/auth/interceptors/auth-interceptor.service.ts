import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError  } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {}

  // Intercept HTTP requests and handle authentication-related actions.
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Log that the request has passed through the authentication interceptor.

    // Handle the request and add error handling using RxJS operators.
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        // If the response status is 401 (Unauthorized), navigate to the 'auth' route.
        if (err.status === 401) {
          this.router.navigateByUrl('/auth');
        }

        // Re-throw the error to propagate it further if needed.
        return throwError( () => err );

      })
    );

  }
}
