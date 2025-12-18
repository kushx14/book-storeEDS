import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

export interface UserInfoState {
  user: any | null;
  token: string | null;
}

export const UserInfoStore = signalStore(
  { providedIn: 'root' },

  withState<UserInfoState>({
    user: null,
    token: null
  }),

  withMethods((store, auth = inject(AuthService)) => ({
    async login(email: string, password: string) {
      const res = await auth.login(email, password);
      patchState(store, { user: res.user, token: res.token });

      localStorage.setItem('auth', JSON.stringify(res));
    },

    async signup(email: string, password: string) {
      const res = await auth.signup(email, password);
      patchState(store, { user: res.user, token: res.token });

      localStorage.setItem('auth', JSON.stringify(res));
    },

    restore() {
      const saved = localStorage.getItem('auth');
      if (saved) {
        const { user, token } = JSON.parse(saved);
        patchState(store, { user, token });
      }
    },

    logout() {
      localStorage.removeItem('auth');
      patchState(store, { user: null, token: null });
    }
  }))
);