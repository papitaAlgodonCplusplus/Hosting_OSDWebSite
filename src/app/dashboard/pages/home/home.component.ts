import { Component, OnInit } from '@angular/core';
import { EventFactoryService } from 'src/app/services/event-factory.service';
import { SecurityDataService } from 'src/app/services/security-data.service';
import { SecurityEventService } from 'src/app/services/security-event.service';
import { RestAPIService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  constructor(
    public eventFactoryService: EventFactoryService,
    private restApiService: RestAPIService, 
    public securityEventService: SecurityEventService,
    public securityDataService: SecurityDataService,
     ){
    }

 
}

