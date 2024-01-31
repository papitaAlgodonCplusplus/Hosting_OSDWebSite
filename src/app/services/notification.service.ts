import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationEvent } from '../models/notificationEvent';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public notificationEventHandler : Subject<NotificationEvent>;

  constructor(private toastrService : ToastrService)
  {
    this.notificationEventHandler = new Subject<NotificationEvent>();
  }

  public sendNotification(notifyEvent : NotificationEvent)
  {
      this.notificationEventHandler.next(notifyEvent);
  }

  public showNotificationToastr(message: string, type : string)
  {
    this.toastrService.info(message, type,
      {
        positionClass: 'toast-bottom-right',
        timeOut: 5000
      })
  }
}
