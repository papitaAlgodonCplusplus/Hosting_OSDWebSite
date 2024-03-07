import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import { WebBaseEvent } from '../models/webBaseEvent';
import { EventFactoryService } from './event-factory.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private webSocketConnection: HubConnection;
  public securityEventHandler : Subject<WebBaseEvent>;
  public logicEventHandler : Subject<WebBaseEvent>;
  public osdEventHandler : Subject<WebBaseEvent>;

  constructor(private eventFactoryService : EventFactoryService)
  {
    this.webSocketConnection = new HubConnectionBuilder()
                                  .withUrl(environment.websocketUrl)
                                  .build();
    this.logicEventHandler = new Subject<WebBaseEvent>();
    this.securityEventHandler = new Subject<WebBaseEvent>();
    this.osdEventHandler = new Subject<WebBaseEvent>();
    this.registerOnServiceChannelSecurityEvents();
    this.registerOnServiceChannelLogicEvents();
    this.registerOnServiceChannelOSDEvents();
  }

private registerOnServiceChannelSecurityEvents(): void {
    this.webSocketConnection.on('HandleSecurityEvent', (jsonEvent: string) => {
      var baseEvent : WebBaseEvent;

      baseEvent = this.eventFactoryService.ConvertJsonToWebBaseEvent(jsonEvent);
      this.securityEventHandler.next(baseEvent);
    });

  }

  private registerOnServiceChannelLogicEvents(): void {
    this.webSocketConnection.on('HandleLogicEvent', (jsonEvent: string) => {
      var baseEvent : WebBaseEvent;

      baseEvent = this.eventFactoryService.ConvertJsonToWebBaseEvent(jsonEvent);
      this.logicEventHandler.next(baseEvent);
    });
  }

  private registerOnServiceChannelOSDEvents(): void {
    this.webSocketConnection.on('HandleOSDEvent', (jsonEvent: string) => {
      var baseEvent : WebBaseEvent;

      baseEvent = this.eventFactoryService.ConvertJsonToWebBaseEvent(jsonEvent);
      this.osdEventHandler.next(baseEvent);
    });
  }

  public startConnection(): void {
    if (this.webSocketConnection.state == HubConnectionState.Disconnected)
    {
      this.webSocketConnection
        .start()
        .then(() => {
          console.log('Websocket connection started');
          //this.connectionEstablished.emit(true); //TODO: check if some logic is necessary
        })
        .catch(err => {
          console.log('Error while establishing connection, retrying...');
          //setTimeout(function () { this.startConnection(); }, 5000);
        });
    }
  }

  public sendSecurityEvent (webBaseEvent: WebBaseEvent)
  {
    var jsonEvent:string;

    jsonEvent = JSON.stringify(webBaseEvent);
    this.webSocketConnection.invoke('ProcessSecurityEvent', jsonEvent)
    .catch(err => console.error(err)); //TODO: send error to local log file or ZeptooBrowser
  }

  public sendOSDEvent (webBaseEvent: WebBaseEvent)
  {
    var jsonEvent:string;

    jsonEvent = JSON.stringify(webBaseEvent);
    this.webSocketConnection.invoke('ProcessOSDEvent', jsonEvent)
    .catch(err => console.error(err)); //TODO: send error to local log file or ZeptooBrowser
  }

  public sendLogicEvent(webBaseEvent: WebBaseEvent)
  {
    var jsonEvent: string;
    jsonEvent = JSON.stringify(webBaseEvent);
    this.webSocketConnection.invoke('ProcessLogicEvent', jsonEvent)
    .catch(err => console.error(err));//TODO: send error to local log file or ZeptooBrowser
  }

  public sendMonitoringEvent (webBaseEvent: WebBaseEvent)
  {
    var jsonEvent:string;

    jsonEvent = JSON.stringify(webBaseEvent);
    this.webSocketConnection.invoke('ProcessMonitoringEvent', jsonEvent)
    .catch(err => console.error(err)); //TODO: send error to local log file or ZeptooBrowser
  }

  public disconnect() {
    this.webSocketConnection.stop();
  }

}
