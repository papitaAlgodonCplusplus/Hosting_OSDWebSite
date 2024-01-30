import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { LogicDataService } from './logic-data.service';
import { EventFactoryService } from './event-factory.service';
import { Subscription } from 'rxjs';
import { WebBaseEvent } from '../models/webBaseEvent';
import { EventAction } from '../models/eventAction';
import { EventConstants } from '../models/eventConstants';
import { ModalActions } from '../store/actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class LogicEventService {
  logicEventSubscriber: Subscription;

  constructor(
    private store: Store,
    private websocketService: WebsocketService,
    private logicDataService: LogicDataService,
    private eventFactoryService: EventFactoryService,
  ) {
    this.logicEventSubscriber = new Subscription();
    this.subscribeToLogicEvents();
  }
  private subscribeToLogicEvents(): void {
    this.logicEventSubscriber =
      this.websocketService.logicEventHandler.subscribe(
        (webBaseEvent: WebBaseEvent) => this.processLogicEvent(webBaseEvent)
      );
  }
 
  //#region RESPONSE HANDLING METHODS
  private processLogicEvent(logicEvent: WebBaseEvent) {
    switch (logicEvent.Action) {
      //TODO: ADD HERE THE LOGIC EVENTS CASES       
      default:
        {
        break;
      }
    }
  }

  
}
