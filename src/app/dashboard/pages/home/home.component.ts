import { Component, OnInit } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  constructor(
    public eventFactoryService: EventFactoryService,
    public websocketService: WebsocketService, 
    public securityEventService: SecurityEventService,
    public securityDataService: SecurityDataService,
     ){
    }

 
}

