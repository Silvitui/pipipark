import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.getUser();

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
