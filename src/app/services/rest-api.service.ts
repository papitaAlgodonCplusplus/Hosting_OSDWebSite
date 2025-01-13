import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, throwError, map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private apiUrl = environment.restAPIUrl;

  constructor(private http: HttpClient) { }

  connectAPI(): Observable<any> {
    return this.http.post(`${this.apiUrl}/control/connect`, null).pipe(
      catchError(error => {
        console.error('connectAPI error:', error);
        throw error;
      })
    );
  }

  disconnectAPI(): Observable<any> {
    return this.http.post(`${this.apiUrl}/control/disconnect`, null).pipe(
      catchError(error => {
        console.error('disconnectAPI error:', error);
        throw error;
      })
    );
  }

  SendSecurityEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processSecurityEvent`, jsonEvent).pipe(
      catchError(error => {
        console.error('SendSecurityEvent error:', error);
        throw error;
      })
    );
  }
  
  SendOSDEvent(jsonEvent: any): Observable<any> {
    console.log('Sending OSDEvent:', jsonEvent);
    return this.http.post(`${this.apiUrl}/events/processOSDEvent`, jsonEvent).pipe(
      map((response: any) => {
        console.log('OSDEvent response:', response);
        // Check for logical errors in the response
        if (response.Body?.ActionRegisterSuccess === false) {
          console.error('SendOSDEvent logic error:', response.Body.ActionRegisterResultMessage);
          throw new Error(`Server Error: ${response.Body.ActionRegisterResultMessage}`);
        }
        return response;
      }),
      catchError(error => {
        console.error('SendOSDEvent network error:', error);
        return throwError(() => new Error(error.message || 'Unknown error'));
      })
    );
  }

  SendLogicEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processLogicEvent`, jsonEvent).pipe(
      catchError(error => {
        console.error('SendLogicEvent error:', error);
        throw error;
      })
    );
  }

  SendNotificationEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processLogicEvent`, jsonEvent).pipe(
      catchError(error => {
        console.error('SendNotificationEvent error:', error);
        throw error;
      })
    );
  }

  SendMonitoringEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processMonitoringEvent`, jsonEvent).pipe(
      catchError(error => {
        console.error('SendMonitoringEvent error:', error);
        throw error;
      })
    );
  }
}
