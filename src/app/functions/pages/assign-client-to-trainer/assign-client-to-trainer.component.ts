import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalActions, UiActions } from 'src/app/store/actions';
import { FreeProfessional } from '../../models/FreeProfessional';
import { OSDService } from 'src/app/services/osd-event.services';
import { OSDDataService } from 'src/app/services/osd-data.service';
import { Subscriber } from '../../models/Subscriber';
import { Observable } from 'rxjs';
import { flush } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assign-client-to-trainer',
  templateUrl: './assign-client-to-trainer.component.html',
  styleUrls: ['./assign-client-to-trainer.component.css']
})
export class AssignClientToTrainerComponent implements OnDestroy {
  subscribers: Subscriber[] = [];
  unassignedSubscribers$: Observable<Subscriber[]> = this.osdDataService.UnassignedSubscribersList$;
  showModal: boolean = false;
  freeProfessionalsTrainersObservable$: Observable<FreeProfessional[]> = this.osdDataService.ProfessionalFreeTrainerList$
  freeProfessionalsTrainers: FreeProfessional[] =[];
  subscribersSelected : string = "";

  constructor(
    private store: Store,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.osdEventService.GetUnassignedSubscribers();
      this.store.dispatch(UiActions.hideLeftSidebar())
      this.store.dispatch(UiActions.hideFooter())
    }, 0);
    this.unassignedSubscribers$.subscribe(subs => {
      this.subscribers = subs
    })
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll())
      this.freeProfessionalsTrainers = {} as FreeProfessional[];
    }, 0);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.subscribers.slice(startIndex, endIndex);
  }

  selectSubscriber(subscriberId: string) {
    this.subscribersSelected = subscriberId;
    setTimeout(() => {
      this.osdEventService.GetProfessionalFreeTrainers()
    }, 0);
    this.freeProfessionalsTrainersObservable$.subscribe(freeProfessionalsTrainers => {
      freeProfessionalsTrainers.forEach(fp => {
        if(fp.Code != null){
          this.freeProfessionalsTrainers.push(fp)
        }
        else{
          if (this.translate.currentLang == "en") {
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "There are no authorized trainers" }));
          }
          else {
            this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: "No hay formadores autorizados" }));
          }
  
          this.store.dispatch(ModalActions.openAlert())
        }
      });
    })
    this.showModal = !this.showModal
    console.log(subscriberId)
  }

  selectTrainer(freeProfessionalId: string) {
    this.store.dispatch(UiActions.toggleConfirmationButton())
    this.showModal = !this.showModal
    this.osdEventService.assignTrainerToSubscriber(this.subscribersSelected,freeProfessionalId)
  }

  closeModal() {
    this.showModal = false;
  }
}
