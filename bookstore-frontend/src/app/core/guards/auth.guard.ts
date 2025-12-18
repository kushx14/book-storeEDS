import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserInfoStore } from '../../store/user-info.store';

export const authGuard: CanActivateFn = () => {
  const userStore = inject(UserInfoStore);
  const router = inject(Router);

  if (!userStore.token()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};