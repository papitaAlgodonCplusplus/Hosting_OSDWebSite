import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {
  private apiUrl = environment.restAPIUrl;

  constructor(private http: HttpClient) { }

  connectAPI(): Observable<any> {
    return this.http.post(`${this.apiUrl}/control/connect`, null);
  }

  disconnectAPI(): Observable<any> {
    return this.http.post(`${this.apiUrl}/control/disconnect`, null);
  }

  SendSecurityEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processSecurityEvent`, jsonEvent);
  }
  
  SendOSDEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processOSDEvent`, jsonEvent);
  }

  SendLogicEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processLogicEvent`, jsonEvent);
  }

  SendNotificationEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processLogicEvent`, jsonEvent);
  }

  SendMonitoringEvent(jsonEvent: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/processMonitoringEvent`, jsonEvent);
  }
}
