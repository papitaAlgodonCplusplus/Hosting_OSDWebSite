import { Injectable } from '@angular/core';
import { DropDownItem } from 'src/app/auth/interfaces/dropDownItem.interface';

@Injectable({
  providedIn: 'root'
})
export class TypesOfPerformanceClaimsService {

  constructor() { }

  getTypesClaimant(): DropDownItem[] {
    var typesClaimant: DropDownItem[] = [{ value: 'INFORMACION ADICIONAL', key: 'INFORMACION ADICIONAL' }, 
                                         { value: 'QUEJA', key: 'QUEJA' }];
    return typesClaimant;
  }

  getTypesSubscriber(): DropDownItem[] {
    var typesClaimant: DropDownItem[] = [{ value: 'RESPUESTA: ALEGACIONES', key: 'RESPUESTA: ALEGACIONES' }, 
                                         { value: 'INFORMACION ADICIONAL', key: 'INFORMACION ADICIONAL' },
                                         { value: 'SUGERENCIA SOLUCION', key: 'SUGERENCIA SOLUCION' },
                                         { value: 'QUEJA', key: 'QUEJA' }];
    return typesClaimant;
  }

  getTypesProcessor(): DropDownItem[] {
    var typesClaimant: DropDownItem[] = [{ value: 'VERIFICACION HECHOS y PRUEBAS', key: 'VERIFICACION HECHOS y PRUEBAS' }, 
                                         { value: 'SOLICITUD AMPLIACION INFORMACION', key: 'QUEJA' },
                                         { value: 'SOLUCION QUEJA', key: 'QUEJA' },
                                         { value: 'SOLUCION AL PROBLEMA', key: 'QUEJA' }];
    return typesClaimant;
  }
}
