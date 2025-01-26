import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reporte-horas',
  templateUrl: './dev_hours.component.html',
  styleUrls: ['./dev_hours.component.css']
})
export class ReporteHorasComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  groupedData: any[] = [];
  expandedDevelopers: string[] = [];
  allData: any[] = []; // Stores the fetched data
  subscriptions: Subscription[] = [];

  constructor(
    private osdService: OSDService,
    private formBuilder: FormBuilder
  ) {
    // Form to filter by developer and category
    this.filterForm = this.createForm();
  }

  ngOnInit(): void {
    this.fetchReportData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Fetch the report data from the backend
  fetchReportData(): void {
    const subscription = this.osdService.GetHorasReport().subscribe((data) => {
      // data.Body?.report is presumably an array of rows
      this.allData = data.Body?.report || [];
      // Group them by 'nombre_miembro'
      this.groupDataByDeveloper(this.allData);
    });
    this.subscriptions.push(subscription);
  }

  // Group records by the developer name
  groupDataByDeveloper(data: any[]): void {
    const grouped = data.reduce((acc, record) => {
      // 'nombre_miembro' = developer name
      const devName = record.nombre_miembro;
      if (!acc[devName]) {
        acc[devName] = [];
      }
      acc[devName].push(record);
      return acc;
    }, {} as Record<string, any[]>);

    // Turn the object into an array for easier *ngFor
    this.groupedData = Object.keys(grouped).map((developer) => ({
      developer,
      records: grouped[developer]
    }));
  }

  // Toggle expand/collapse of a developer’s table
  toggleExpand(developer: string): void {
    if (this.expandedDevelopers.includes(developer)) {
      this.expandedDevelopers = this.expandedDevelopers.filter(
        (dev) => dev !== developer
      );
    } else {
      this.expandedDevelopers.push(developer);
    }
  }

  // Initialize the filter form with developer + category controls
  createForm(): FormGroup {
    return this.formBuilder.group({
      developer: [''],
      category: ['']
    });
  }

  // Apply filters on the local data
  filterReport(): void {
    const developer = this.filterForm.value.developer?.toLowerCase();
    const category = this.filterForm.value.category?.toLowerCase();

    const filteredData = this.allData.filter((record) => {
      const matchesDeveloper = developer
        ? record.nombre_miembro?.toLowerCase().includes(developer)
        : true;

      const matchesCategory = category
        ? record.categoria?.toLowerCase().includes(category)
        : true;

      return matchesDeveloper && matchesCategory;
    });

    this.groupDataByDeveloper(filteredData);
  }

  // Clear filters and show all data
  clearFilters(): void {
    this.filterForm.reset();
    this.groupDataByDeveloper(this.allData);
  }
}
