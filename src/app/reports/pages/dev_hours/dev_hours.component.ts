import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';
import { Subscription } from 'rxjs';

interface DropDownItem {
  key: string;
  value: string;
}

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
  summaryData: {
    totalHours: number;
    totalIncome: number;
    firstDate: Date | null;
    lastDate: Date | null;
    developers: string;
  } | null = null;

  developer_categoryOptions: DropDownItem[] = [
    { key: 'Edición Formularios', value: 'Edición Formularios' },
    { key: 'Funcionalidad aplicación', value: 'Funcionalidad aplicación' },
    { key: 'Seguridad y Privacidad', value: 'Seguridad y Privacidad' },
    { key: 'Actualización Contenidos', value: 'Actualización Contenidos' },
    { key: 'Navegación Usuario', value: 'Navegación Usuario' }
  ];

  developer_moduleOptions: DropDownItem[] = [
    { key: 'Gestor Usuarios/Perfiles', value: 'Gestor Usuarios/Perfiles' },
    { key: 'Gestor Expediente: Reclamación o Sugerencia de Mejora', value: 'Gestor Expediente: Reclamación o Sugerencia de Mejora' },
    { key: 'Gestión Ética y Transparente de Proyecto', value: 'Gestión Ética y Transparente de Proyecto' },
    { key: 'Gestor Mapa Recursos Naturales', value: 'Gestor Mapa Recursos Naturales' },
    { key: 'Gestor Formación OSD', value: 'Gestor Formación OSD' },
    { key: 'Transparencia Informes', value: 'Transparencia Informes' }
  ];

  developer_screen_formOptions: DropDownItem[] = [
    { key: 'Cliente', value: 'Cliente' },
    { key: 'Profesional Libre', value: 'Profesional Libre' },
    { key: 'Reclamante', value: 'Reclamante' },
    { key: 'Centro de Formación Homologado', value: 'Centro de Formación Homologado' },
    { key: 'RE Expediente', value: 'RE Expediente' },
    { key: 'RE Actuación', value: 'RE Actuación' },
  ];

  developer_activityOptions: DropDownItem[] = [
    { key: 'Desarrollo', value: 'Desarrollo' },
    { key: 'Actualización (Mejora Continua)', value: 'Actualización (Mejora Continua)' },
    { key: 'Mantenimiento', value: 'Mantenimiento' },
    { key: 'Diseño gráfico', value: 'Diseño gráfico' },
    { key: 'Documentación', value: 'Documentación' }
  ];

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
      console.log(data);
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
      category: [''],
      subcategory: [''],
      module: [''],
      screen: ['']
    });
  }

  // Apply filters on the local data
  filterReport(): void {
    const developer = this.filterForm.value.developer?.toLowerCase() || '';
    const category = this.filterForm.value.category?.toLowerCase() || '';
    const subcategory = this.filterForm.value.subcategory?.toLowerCase() || '';
    const module = this.filterForm.value.module?.toLowerCase() || '';
    const screen = this.filterForm.value.screen?.toLowerCase() || '';
    const filteredData = this.allData.filter((record) => {
      console.log("Comparing: ", record.nombre_miembro?.toLowerCase(), developer);
      const matchesDeveloper = developer
        ? record.nombre_miembro?.toLowerCase().includes(developer)
        : true;
      console.log("Comparing: ", record.registro_actividad?.toLowerCase(), category);

      const matchesCategory = category
        ? record.registro_actividad?.toLowerCase().includes(category)
        : true;
      console.log("Comparing: ", record.categoria?.toLowerCase(), subcategory);

      const matchesSubcategory = subcategory
        ? record.categoria?.toLowerCase().includes(subcategory)
        : true;
      console.log("Comparing: ", record.modulo?.toLowerCase(), module);

      const matchesModule = module
        ? record.modulo?.toLowerCase().includes(module)
        : true;
      console.log("Comparing: ", record.formulario_pantalla?.toLowerCase(), screen);

      const matchesScreen = screen
        ? record.formulario_pantalla?.toLowerCase().includes(screen)
        : true;


      return matchesDeveloper && matchesCategory && matchesSubcategory && matchesModule && matchesScreen;
    });

    this.groupDataByDeveloper(filteredData);
    this.updateSummary(filteredData); // Update summary based on filtered data
  }

  updateSummary(data: any[]): void {
    if (data.length === 0) {
      this.summaryData = null;
      return;
    }

    const totalHours = data.reduce((sum, record) => sum + (parseInt(record.horas_trabajadas) || 0), 0);
    const totalIncome = data.reduce((sum, record) => sum + (parseInt(record.importe) || 0), 0);
    const dates = data.map((record) => new Date(record.fecha));
    const firstDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const lastDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Collect unique developers who worked on the records
    const developers = Array.from(new Set(data.map((record) => record.nombre_miembro))).join(', ');

    this.summaryData = { totalHours, totalIncome, firstDate, lastDate, developers };
  }


  clearFilters(): void {
    this.filterForm.reset();
    this.groupDataByDeveloper(this.allData);
  }
}
