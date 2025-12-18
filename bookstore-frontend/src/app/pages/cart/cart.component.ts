import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { BooksStore } from '../../store/books.store';
import { UserInfoStore } from '../../store/user-info.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Your Cart</h2>

    <div *ngFor="let item of cart.items()">
      {{ item.title }}
      <button (click)="remove(item._id)">Remove</button>
    </div>

    <button (click)="checkout()" [disabled]="cart.items().length === 0">
      Checkout
    </button>
  `
})
export class CartComponent {
  cart = inject(CartStore);
  books = inject(BooksStore);
  user = inject(UserInfoStore);
  router = inject(Router);

  remove(id: string) {
    this.cart.removeFromCart(id);
  }

  async checkout() {
    for (const book of this.cart.items()) {
      await this.books.buyBook(book._id);
    }
    this.cart.clearCart();
    this.router.navigate(['/profile']);
  }
}