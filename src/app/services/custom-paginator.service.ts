import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class CustomPaginator {

  constructor(private translateService: TranslateService) {
  }

  public getSpanishPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    this.translateService.onLangChange.subscribe(() => {
      this.updateLabels(paginatorIntl);
    });
    this.updateLabels(paginatorIntl);
    return paginatorIntl;
  }

  private updateLabels(paginatorIntl: MatPaginatorIntl): void {
    paginatorIntl.itemsPerPageLabel = this.translateService.instant('ItemsPerPage');
    paginatorIntl.nextPageLabel = this.translateService.instant('NextPage');
    paginatorIntl.previousPageLabel = this.translateService.instant('PreviousPage');
    paginatorIntl.firstPageLabel = this.translateService.instant('FirstPage');
    paginatorIntl.lastPageLabel = this.translateService.instant('LastPage');
    paginatorIntl.getRangeLabel = this.spanishRangeLabel.bind(this);
    paginatorIntl.changes.next();
  }

  spanishRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    if (startIndex >= length) {
      return `0 / ${length}`;
    }

    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}

