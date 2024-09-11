import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';

@Injectable({
  providedIn: 'root'
})
export class TypesOfPerformanceClaimsService {

  constructor(private translate : TranslateService) { }

  getTypesClaimant(): DropDownItem[] {
    var typesClaimant: DropDownItem[] = [
      { value: this.translate.instant('Additional Information'), key: 'Additional Information' }, 
      { value: this.translate.instant('Complaint'), key: 'Complaint' }
    ];
    return typesClaimant;
  }
  
  getTypesSubscriber(): DropDownItem[] {
    var typesSubscriber: DropDownItem[] = [
      { value: this.translate.instant('Response: Allegations'), key: 'Response: Allegations' }, 
      { value: this.translate.instant('Additional Information'), key: 'Additional Information' },
      { value: this.translate.instant('Suggestion for Solution'), key: 'Suggestion for Solution' },
      { value: this.translate.instant('Complaint'), key: 'Complaint' }
    ];
    return typesSubscriber;
  }
  
  getTypesProcessor(): DropDownItem[] {
    var typesProcessor: DropDownItem[] = [
      { value: this.translate.instant('Verification of Facts and Evidence'), key: 'Verification of Facts and Evidence' }, 
      { value: this.translate.instant('Request for Additional Information'), key: 'Request for Additional Information' },
      { value: this.translate.instant('Complaint Resolution'), key: 'Complaint Resolution' },
      { value: this.translate.instant('Problem Solution'), key: 'Problem Solution' }
    ];
    return typesProcessor;
  }
  
}
