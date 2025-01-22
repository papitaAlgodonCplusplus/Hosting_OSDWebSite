import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OSDService } from '../services/osd-event.services';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor(private http: HttpClient, private osdService: OSDService) { }

  logAction(userId: string, action: string, pageUrl?: string, elementClicked?: string, additionalInfo?: any) {
    const logData = {
      userId,
      action,
      pageUrl: pageUrl || window.location.href,
      elementClicked,
      additionalInfo,
    };

    this.osdService.logEvent(logData).subscribe({
    });
  }
}
