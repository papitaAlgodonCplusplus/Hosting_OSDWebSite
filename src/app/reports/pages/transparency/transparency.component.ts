import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UiActions } from 'src/app/store/actions';
import { UiSelectors } from 'src/app/store/selectors';

@Component({
  selector: 'app-transparency',
  templateUrl: './transparency.component.html',
  styleUrls: ['./transparency.component.css']
})
export class TransparencyComponent implements OnDestroy{

  leftSidebarOpen$: Observable<boolean> = this.store.select(UiSelectors.leftSidebarOpen);
  arrowLeftSidebar : boolean = false;

  constructor(
    private store : Store
  ){

  }

  ngOnInit(): void{
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);
  }
  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }
  
  //function to toggle the boolean value to open or close the sidebar
  toggleLeftSidebar(): void {
    this.store.dispatch(UiActions.toggleLeftSidebar());
    if(this.arrowLeftSidebar === true){
      this.arrowLeftSidebar = false;
    }
  }

  showArrow(): void{
      this.arrowLeftSidebar = true;
      
  }
  
  hideArrow(): void{
    this.arrowLeftSidebar = false;
  }
}
