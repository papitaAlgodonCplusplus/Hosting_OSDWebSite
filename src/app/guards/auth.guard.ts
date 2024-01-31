import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

// Define an authentication guard function to check if the user has a valid authentication token.
export const authGuard: CanMatchFn = (route, segments) => {
  // Inject the AuthService to access authentication-related functionality.
  const authService = inject(AuthService);
  // Check if the user has a valid authentication token.
  return authService.getAuthToken();
};
