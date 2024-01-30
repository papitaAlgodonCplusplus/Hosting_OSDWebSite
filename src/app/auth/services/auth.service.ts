import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthSelectors } from 'src/app/store/selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Declare a private observable, 'authToken$', to select and observe the authentication token from the store.
  private authToken$: Observable<boolean> = this.store.select(AuthSelectors.authenticationToken);

  constructor(private store: Store, private http: HttpClient) { }

  // A function to retrieve the authentication token as an observable.
  getAuthToken(): Observable<boolean>{
    return this.authToken$;
  }

  // Simulate an HTTP request using HttpClient and return an observable of the response.
  simulateHttpRequest(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
  }
}
