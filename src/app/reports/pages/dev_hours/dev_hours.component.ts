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
  allData: any[] = []; // Stores all the fetched data
  subscriptions: Subscription[] = [];

  constructor(
    private osdService: OSDService,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.createForm();
  }

  ngOnInit(): void {
    this.fetchReportData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  fetchReportData(): void {
    const subscription = this.osdService.GetHorasReport().subscribe((data) => {
      this.allData = data.Body?.report || []; // Store all data locally
      this.groupDataByDeveloper(this.allData); // Initialize grouped data with all data
    });
    this.subscriptions.push(subscription);
  }

  groupDataByDeveloper(data: any[]): void {
    const grouped = data.reduce((acc, record) => {
      const devName = record.nombre_miembro;
      if (!acc[devName]) {
        acc[devName] = [];
      }
      acc[devName].push(record);
      return acc;
    }, {});

    this.groupedData = Object.keys(grouped).map((developer) => ({
      developer,
      records: grouped[developer]
    }));
  }

  toggleExpand(developer: string): void {
    if (this.expandedDevelopers.includes(developer)) {
      this.expandedDevelopers = this.expandedDevelopers.filter(
        (dev) => dev !== developer
      );
    } else {
      this.expandedDevelopers.push(developer);
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      developer: [''],
      category: ['']
    });
  }

  filterReport(): void {
    const developer = this.filterForm.value.developer?.toLowerCase();
    const category = this.filterForm.value.category?.toLowerCase();

    // Filter locally stored data
    const filteredData = this.allData.filter((record) => {
      const matchesDeveloper = developer
        ? record.nombre_miembro.toLowerCase().includes(developer)
        : true;
      const matchesCategory = category
        ? record.categoria.toLowerCase().includes(category)
        : true;

      return matchesDeveloper && matchesCategory;
    });

    this.groupDataByDeveloper(filteredData); // Update grouped data with filtered data
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.groupDataByDeveloper(this.allData); // Reset to display all data
  }
}
