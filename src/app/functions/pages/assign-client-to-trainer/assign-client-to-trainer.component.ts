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
import { Subscription } from 'rxjs';

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
  freeProfessionalsTrainers: FreeProfessional[] = [];
  subscribersSelected: string = "";
  private subscription: Subscription | null = null;

  constructor(
    private store: Store,
    private osdEventService: OSDService,
    private osdDataService: OSDDataService,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    setTimeout(() => {
      this.osdEventService.GetUnassignedSubscribers();
    }, 0);
    this.unassignedSubscribers$.subscribe(subs => {
      this.subscribers = subs
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

    // Reset the list before fetching
    this.freeProfessionalsTrainers = [];

    // Ensure the modal toggles correctly
    this.showModal = !this.showModal;

    setTimeout(() => {
      this.osdEventService.GetProfessionalFreeTrainers();
    }, 0);

    // Unsubscribe from any previous subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Subscribe to the observable
    this.subscription = this.freeProfessionalsTrainersObservable$.subscribe(freeProfessionalsTrainers => {
      freeProfessionalsTrainers.forEach(fp => {
        if (fp.Code != null) {
          this.freeProfessionalsTrainers.push(fp);
        } else {
          const alertMessage =
            this.translate.currentLang === 'en'
              ? 'There are no authorized trainers'
              : 'No hay formadores autorizados';

          this.store.dispatch(ModalActions.addAlertMessage({ alertMessage }));
          this.store.dispatch(ModalActions.openAlert());
        }
      });
    });
  }

  selectTrainer(freeProfessionalId: string) {
    this.store.dispatch(UiActions.toggleConfirmationButton())
    this.showModal = !this.showModal
    this.osdEventService.assignTrainerToSubscriber(this.subscribersSelected, freeProfessionalId)
    this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Client assigned to trainer' }))
    this.store.dispatch(ModalActions.openAlert())
  }

  closeModal() {
    this.showModal = false;
  }
}
