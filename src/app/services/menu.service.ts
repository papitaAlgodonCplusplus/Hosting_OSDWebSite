import { Injectable } from '@angular/core';
import { MenuOption } from '../models/menuOptions';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  getMenuOptionFreeProfessional(): MenuOption[] {
    return [
        { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
        { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
    ];
}

getMenuOptionAdmin(): MenuOption[] {
    return [
        { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
        { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' },
        { name: 'authorizeCustomers', path: '/functions/sub-authorized', icon: 'fa-check-circle' },
        { name: 'authorizeFreeProfessionals', path: '/functions/autorization-pl', icon: 'fa-check-circle' }
    ];
}

getMenuOptionClaimant(): MenuOption[] {
    return [
        { name: 'presentar_reclamación', path: '/onboarding/onboarding-register-claimant/False', icon: 'fa-balance-scale' },
        { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
    ];
}

getMenuOptionCFH(): MenuOption[] {
    return [
        //{ name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' }
    ];
}

getMenuOptionSubscriber(): MenuOption[] {
    return [
        { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
    ];
}
}

