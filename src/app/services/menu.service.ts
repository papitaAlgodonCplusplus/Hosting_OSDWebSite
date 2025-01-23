import { Injectable } from '@angular/core';
import { MenuOption } from '../models/menuOptions';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private authService: AuthenticationService) {}

  private createMenuOption(
    name: string,
    path: string,
    icon: string,
    color: string
  ): MenuOption {
    return { name, path, icon, color };
  }

  getMenuOptionAllFreeProfessional(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('presentar_reclamación', '/onboarding/onboarding-register-claimant/False', 'fa-balance-scale', 'bg-red-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'), 
    ];
  }

  getMenuOptionFreeProfessionalProcessor(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
    ];
  }

  getMenuOptionFreeProfessionalTrainer(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('Assign_Processor_to_Claim', '/functions/assign-pltr-claims', 'fa-user', 'bg-green-500'),
      this.createMenuOption('accounting', '/functions/accounting', 'fa-money-check-alt', 'bg-purple-500'),
      this.createMenuOption('administer_users', '/functions/students-management', 'fa-graduation-cap', 'bg-teal-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
    ];
  }

  getMenuOptionAdmin(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('Assign_client_to_Trainer', '/functions/assign-client-to-Trainer', 'fa-user', 'bg-orange-500'),
      this.createMenuOption('authorizeCustomers', '/functions/sub-authorized', 'fa-check-circle', 'bg-green-500'),
      this.createMenuOption('authorizeFreeProfessionals', '/functions/autorization-pl', 'fa-check-circle', 'bg-teal-500'),
      this.createMenuOption('Assign_Processor_to_Claim', '/functions/assign-pltr-claims', 'fa-user', 'bg-yellow-500'),
      // this.createMenuOption('accounting_services', '/functions/accounting-services', 'fa-calculator', 'bg-purple-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
      this.createMenuOption('administer_users', '/functions/students-management', 'fa-graduation-cap', 'bg-teal-500'),
      this.createMenuOption('accounting', '/functions/accounting', 'fa-money-check-alt', 'bg-purple-500'),
      this.createMenuOption('fp_management', '/functions/fp-management', 'fa-users-cog', 'bg-pink-500'),
      this.createMenuOption('logs', '/functions/logs', 'fa-file-alt', 'bg-gray-500'),
    ];
  }

  getMenuOptionClaimant(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('presentar_reclamación', '/onboarding/onboarding-register-claimant/False', 'fa-balance-scale', 'bg-red-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
    ];
  }

  getMenuOptionCFH(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('Assign_Processor_to_Claim', '/functions/assign-pltr-claims', 'fa-user', 'bg-green-500'),
      this.createMenuOption('Assign_New_Free_Professional', '/functions/assign-nfp', 'fa-user-plus', 'bg-orange-500'),
      this.createMenuOption('administer_users', '/functions/students-management', 'fa-graduation-cap', 'bg-teal-500'),
      this.createMenuOption('accounting', '/functions/accounting', 'fa-money-check-alt', 'bg-purple-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
    ];
  }

  getMenuOptionSubscriber(): MenuOption[] {
    return [
      this.createMenuOption('transparent_project', '/project-manager', 'fa-project-diagram', 'bg-indigo-500'),
      this.createMenuOption('presentar_reclamación', '/onboarding/onboarding-register-claimant/False', 'fa-balance-scale', 'bg-red-500'),
      this.createMenuOption('Assign_Processor_to_Claim', '/functions/assign-pltr-claims', 'fa-user', 'bg-green-500'),
      this.createMenuOption('file_claim', '/functions/claims-file', 'fa-file', 'bg-yellow-500'),
      this.createMenuOption('edit_user_profile', '/functions/edit-my-info', 'fa-user-edit', 'bg-blue-500'),
      this.createMenuOption('Assign_New_Free_Professional', '/functions/assign-nfp', 'fa-user-plus', 'bg-orange-500'),
    ];
  }
}
