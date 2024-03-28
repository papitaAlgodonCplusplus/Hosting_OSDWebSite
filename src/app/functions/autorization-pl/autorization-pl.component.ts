import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';

@Component({
  selector: 'app-autorization-pl',
  templateUrl: './autorization-pl.component.html',
  styleUrls: ['./autorization-pl.component.css']
})
export class AutorizationPlComponent implements OnDestroy {
  abogados = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María González' },
    { id: 3, nombre: 'Luisa Martínez' },
    { id: 4, nombre: 'Pedro Sánchez' }
  ];

  constructor(private store: Store
  ) {
  }

  modalVisible = false; 

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
}
