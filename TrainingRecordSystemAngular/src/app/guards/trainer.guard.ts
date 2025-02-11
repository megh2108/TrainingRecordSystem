import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { inject } from '@angular/core';
import { LocalstorageService } from '../services/helpers/localstorage.service';
import { LocalStorageKeys } from '../services/helpers/localstoragekeys';
import { map, Observable } from 'rxjs';

export const trainerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const localStorageHelper = inject(LocalstorageService);
  const router = inject(Router);

  const userIdString = localStorageHelper.getItem(LocalStorageKeys.UserId);
  const userId = userIdString ? Number(userIdString) : undefined;

  if (!userId) {
    router.navigate(['/home']);
    return false;
  }

  return authService.getUserDetailsByUserId(userId).pipe(
    map(response => {
      if (response.data && response.data.role == 2) {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  ) as Observable<boolean>;
};
