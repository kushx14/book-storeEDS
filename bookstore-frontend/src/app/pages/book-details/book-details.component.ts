import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksStore } from '../../store/books.store';
import { UserInfoStore } from '../../store/user-info.store';
import { CartStore } from '../../store/cart.store';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="store.selectedBook() as book; else loading">
      <div class="details">
        <img [src]="'http://localhost:3001' + book.image" />

        <div class="info">
          <h2>{{ book.title }}</h2>
          <h4>by {{ book.author }}</h4>
          <p>{{ book.overview }}</p>
          <p>Copies Available: {{ book.copiesAvailable }}</p>

          <div class="actions">
            <button (click)="buy()" [disabled]="book.copiesAvailable === 0 || isOwnBook()">Buy</button>
            <div>
              <input type="number" [(ngModel)]="rentDays" placeholder="Days to rent" min="1" />
              <button (click)="rent()" [disabled]="book.copiesAvailable === 0 || isOwnBook()">Rent</button>
            </div>
            <button (click)="addToCart()" [disabled]="book.copiesAvailable === 0 || isOwnBook()">Add to Cart</button>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #loading>
      <p>Loading book details...</p>
    </ng-template>
  `,
  styles: [`
    .details {
      display: flex;
      gap: 20px;
    }
    img {
      width: 250px;
      height: 350px;
      object-fit: cover;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 20px;
    }
    button {
      padding: 10px;
      cursor: pointer;
    }
  `]
})
export class BookDetailsComponent implements OnInit {
  store = inject(BooksStore);
  route = inject(ActivatedRoute);
  userStore = inject(UserInfoStore);
  cart = inject(CartStore);
  router = inject(Router);

  rentDays = 7;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.store.loadBookById(id);
  }

  async buy() {
    await this.store.buyBook(this.store.selectedBook()!._id);
    this.router.navigate(['/profile']);
  }

  async rent() {
    await this.store.rentBook(this.store.selectedBook()!._id, this.rentDays);
    this.router.navigate(['/profile']);
  }

  addToCart() {
    this.cart.addToCart(this.store.selectedBook());
  }

  isOwnBook() {
    return this.store.selectedBook()!.owner === this.userStore.user()?.id;
  }
}