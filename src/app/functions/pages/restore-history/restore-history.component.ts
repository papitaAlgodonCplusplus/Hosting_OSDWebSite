import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restore-history',
  templateUrl: './restore-history.component.html',
  styleUrls: ['./restore-history.component.css']
})
export class RestoreHistoryComponent implements OnInit {
  displayedItems: any[] = [];
  histories: any[] = [];
  constructor() { }

  ngOnInit() {
  }

  showDate(dateAndHour: string): string {
    const [datePart, timePart] = dateAndHour.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');

    const fechaConHora = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    const soloFecha = fechaConHora.toLocaleDateString();

    return soloFecha;
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    //this.updateDisplayedItems(startIndex, endIndex);
  }

  restoreHistory(history : any){
    //ToDo
  }

}
