import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState({
    items: [] as any[]
  }),

  withComputed(({ items }) => ({
    totalItems: computed(() => items().length)
  })),

  withMethods((store) => ({
    addToCart(book: any) {
      patchState(store, { items: [...store.items(), book] });
    },

    removeFromCart(id: string) {
      patchState(store, { items: store.items().filter(b => b._id !== id) });
    },

    clearCart() {
      patchState(store, { items: [] });
    }
  }))
);