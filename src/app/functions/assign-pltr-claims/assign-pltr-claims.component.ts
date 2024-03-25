import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UiActions } from 'src/app/store/actions';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-assign-pltr-claims',
  templateUrl: './assign-pltr-claims.component.html',
  styleUrls: ['./assign-pltr-claims.component.css']
})
export class AssignPLTRClaimsComponent {
  searchTerm: string = '';

  constructor(private store: Store, private translate : TranslateService
  ) {
  }
  pageSize = 5; // Cambia esto al número de elementos que quieras mostrar por página
  currentPage = 1; // La página actual
  totalItems: number = 1; // El total de elementos en tu arreglo de reclamaciones
  totalPages: number = 1; // El total de páginas

  reclamacionesMunicipalidad = [
      { id: 1, nombre: 'Juan Pérez', tipo: 'Queja por servicio de recolección de basura' },
      { id: 2, nombre: 'María González', tipo: 'Solicitud de reparación de bache en la calle principal' },
      { id: 3, nombre: 'Luisa Martínez', tipo: 'Reporte de semáforo averiado en la intersección de Avenida Libertad' },
      { id: 4, nombre: 'Pedro Sánchez', tipo: 'Petición de poda de árboles en el parque central' },
      { id: 5, nombre: 'Ana Rodríguez', tipo: 'Queja por falta de iluminación en parque infantil' },
      { id: 6, nombre: 'Carlos López', tipo: 'Solicitud de limpieza de graffiti en paredes del centro histórico' },
      { id: 7, nombre: 'Sofía Hernández', tipo: 'Reporte de agujero en la vía pública en la calle 5 de Mayo' },
      { id: 8, nombre: 'Javier García', tipo: 'Petición de instalación de banco en plaza del barrio' },
      { id: 9, nombre: 'Laura Fernández', tipo: 'Queja por ruido excesivo en horario nocturno en zona residencial' },
      { id: 10, nombre: 'Laura Rodríguez', tipo: 'Solicitud de señalización vial en cruce peligroso' },
      { id: 11, nombre: 'Elena Díaz', tipo: 'Reporte de fuga de agua en tubería de la calle 20 de Noviembre' },
      { id: 12, nombre: 'Andrés Martínez', tipo: 'Petición de mantenimiento de parque infantil en el barrio San José' },
      { id: 13, nombre: 'Isabel López', tipo: 'Queja por acumulación de basura en contenedor comunitario' },
      { id: 14, nombre: 'Miguel Sánchez', tipo: 'Solicitud de pintura de pasos peatonales en avenida principal' },
      //{ id: 15, nombre: 'Carmen García', tipo: 'Reporte de vandalismo en paradas de autobús' }
  ];
  profesionalesLibres = [
    { id: 1, nombre: 'Juan Pérez' },
    { id: 2, nombre: 'María González' },
    { id: 3, nombre: 'Laura Martínez' },
    { id: 4, nombre: 'Pedro Sánchez' },
    { id: 5, nombre: 'Ana Rodríguez' },
    { id: 6, nombre: 'Anthony Retana' }
  ];

  selectedProfesional: { id: number; nombre: string; } = { id: 0, nombre: '' };;
  filteredProfesionales: { id: number, nombre: string }[] = [];


  filterProfesionales() {
    if(this.selectedProfesional){
      if (this.searchTerm.trim() !== '') {
        this.filteredProfesionales = this.profesionalesLibres.filter(profesional =>
          profesional.nombre.toLowerCase().includes(this.selectedProfesional.nombre.toLowerCase())
        );
      } else {
        this.filteredProfesionales = [...this.profesionalesLibres];
      }
    }
  }
  

  selectProfesional(profesional: { id: number, nombre: string }) {
    // Aquí puedes hacer lo que necesites con el profesional seleccionado
    console.log('Profesional seleccionado:', profesional);
    this.selectedProfesional.nombre = profesional.nombre;
    this.filteredProfesionales = [];
  }

  totalPagesProfessionals=1;

  modalVisible = false; 

  ngOnInit(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.hideAll());
    }, 0);

    // Actualiza el total de profesionales libres y el número total de páginas
    this.totalProfessionals = this.profesionalesLibres.length;
    this.totalPagesProfessionals = Math.ceil(this.profesionalesLibres.length / this.pageSizeProfessionals);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.store.dispatch(UiActions.showAll());
    }, 0);
  }


  reclamoSeleccionado: any;
  toggleModal(reclamo?: any) {
    this.modalVisible = !this.modalVisible;
    if (reclamo) {
        this.reclamoSeleccionado = reclamo;
    }
  } 

  setPage(page: number) {
    if(this.totalPages){
      if (page < 1 || page > this.totalPages) {
        return;
      }
      this.currentPage = page;
    }
  }

  get reclamacionesPaginaActual() {
    let reclamacionesFiltradas = this.reclamacionesMunicipalidad;
  
    // Filtrar por término de búsqueda si está presente
    if (this.searchTerm.trim() !== '') {
      reclamacionesFiltradas = reclamacionesFiltradas.filter(reclamacion =>
        reclamacion.tipo.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }
  
    // Calcular los índices de paginación
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize - 1, reclamacionesFiltradas.length - 1);
  
    // Devolver solo las reclamaciones de la página actual
    return reclamacionesFiltradas.slice(startIndex, endIndex + 1);
  }
  selectProfessional(professional: { id: number, nombre: string }) {
    // Aquí puedes implementar la lógica para manejar la selección del profesional
    console.log('Profesional seleccionado:', professional);
    // Por ejemplo, podrías asignar el profesional seleccionado a una propiedad del componente
    this.selectedProfesional = professional;
  }
  pageSizeProfessionals = 3; // Cambia esto al número de profesionales que quieras mostrar por página
  currentPageProfessionals = 1; // La página actual de profesionales
  totalProfessionals: number = 0; // El total de profesionales libres

  get professionalsPage() {
    const startIndex = (this.currentPageProfessionals - 1) * this.pageSizeProfessionals;
    const endIndex = Math.min(startIndex + this.pageSizeProfessionals, this.profesionalesLibres.length);
    return this.profesionalesLibres.slice(startIndex, endIndex);
}


  setPageProfessionals(page: number) {
    if (page < 1 || page > this.totalPagesProfessionals) {
      return;
    }
    this.currentPageProfessionals = page;
  }

}
