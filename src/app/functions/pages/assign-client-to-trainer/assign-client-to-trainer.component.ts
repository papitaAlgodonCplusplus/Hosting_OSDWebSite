import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { FreeProfessional } from '../../models/FreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { Subscriber } from '../../models/Subscriber';
import { Observable } from 'rxjs';
import { flush } from '@angular/core/testing';

@Component({
  selector: 'app-assign-client-to-trainer',
  templateUrl: './assign-client-to-trainer.component.html',
  styleUrls: ['./assign-client-to-trainer.component.css']
})
export class AssignClientToTrainerComponent implements OnDestroy{
  subscribers!: Subscriber[];
  unassignedSubscribers$: Observable<Subscriber[]> = this.osdDataService.UnassignedSubscribersList$;
  showModal: boolean = false;
  
  constructor(
    private store: Store,
    private osdEventService : OSDService,
    private osdDataService : OSDDataService
  ){}
  ngOnInit() : void{
    setTimeout(() => {
      this.osdEventService.GetUnassignedSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar())
        this.store.dispatch(UiActions.hideFooter())
    }, 0);
    this.unassignedSubscribers$.subscribe(subs =>{
      this.subscribers = subs
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
    }, 0);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.subscribers.slice(startIndex, endIndex);
  }

  selectSubscriber(subscriberId : string){
    this.showModal = !this.showModal
    console.log(subscriberId)
  }

  selectTrainer(subscriberId : string){
    setTimeout(() => {
      this.osdEventService.GetProfessionalFreeTrainers()
    }, 0);
    this.showModal = !this.showModal
    console.log(subscriberId)
  }

  closeModal(){
    this.showModal = false;
  }
}
