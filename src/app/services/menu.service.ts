import { Injectable, OnInit } from '@angular/core';
import { MenuOption } from '../models/menuOptions'
import { AuthenticationService } from './authentication.service';
import { UserInfo } from '../models/userInfo';


@Injectable({
    providedIn: 'root'
})
export class MenuService implements OnInit {
    user!: UserInfo;

    constructor(private authService: AuthenticationService) { }

    ngOnInit(): void {
        setTimeout(() => {
            if (this.authService.userInfo) { console.log(this.user); this.user = this.authService.userInfo };
        }, 0);
    }

    getMenuOptionAllFreeProfessional(): MenuOption[] {
        return [
            { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
        ];
    }

    getMenuOptionFreeProfessionalProcessor(): MenuOption[] {
        return [
            { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
            { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' },
        ];
    }

    getMenuOptionFreeProfessionalTrainer(): MenuOption[] {
        return [
            { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
            { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' },
            { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' },
            { name: 'administer_users', path: '/functions/students-management', icon: 'fa-light fa-graduation-cap' },
            { name: 'accounting', path: '/functions/accounting', icon: 'fa-money-check-alt' }
        ];
    }

    getMenuOptionAdmin(): MenuOption[] {
        return [
            { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
            { name: 'Assign_client_to_Trainer', path: '/functions/assign-client-to-Trainer', icon: 'fa-user' },
            { name: 'authorizeCustomers', path: '/functions/sub-authorized', icon: 'fa-check-circle' },
            { name: 'authorizeFreeProfessionals', path: '/functions/autorization-pl', icon: 'fa-check-circle' },
            //{ name: 'CFH', path: '/home', icon: 'fa-school' },
            { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' },
            { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' }
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
            { name: 'transparent_project', path: '/project-manager', icon: 'fa-project-diagram' },
            { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' },
            { name: 'Assign_Processor_to_Claim', path: '/functions/assign-pltr-claims', icon: 'fa-user' },
            { name: 'administer_users', path: '/functions/students-management', icon: 'fa-light fa-graduation-cap' },
            { name: 'accounting', path: '/functions/accounting', icon: 'fa-money-check-alt' }
        ];
    }

    getMenuOptionSubscriber(): MenuOption[] {
        return [
            { name: 'file_claim', path: '/functions/claims-file', icon: 'fa-file' }
        ];
    }
}

