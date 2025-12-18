import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksService } from '../../core/services/books.service';
import { UserInfoStore } from '../../store/user-info.store';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>User Profile</h2>
      <div class="user-info">
        <p><strong>Email:</strong> {{ userStore.user()?.email }}</p>
      </div>

      <div class="books-section">
        <h3>Published Books</h3>
        <div class="books-grid">
          <div *ngFor="let b of data.published" class="book-card">
            <img [src]="'http://localhost:3001' + b.image" alt="book cover" />
            <h4>{{ b.title }}</h4>
            <p>by {{ b.author }}</p>
            <p>Copies Available: {{ b.copiesAvailable }}</p>
          </div>
          <div *ngIf="data.published.length === 0" class="no-books">No published books yet.</div>
        </div>
      </div>

      <div class="books-section">
        <h3>Bought Books</h3>
        <div class="books-grid">
          <div *ngFor="let b of data.bought" class="book-card">
            <img [src]="'http://localhost:3001' + b.image" alt="book cover" />
            <h4>{{ b.title }}</h4>
            <p>by {{ b.author }}</p>
          </div>
          <div *ngIf="data.bought.length === 0" class="no-books">No bought books yet.</div>
        </div>
      </div>

      <div class="books-section">
        <h3>Rented Books</h3>
        <div class="books-grid">
          <div *ngFor="let b of data.rented" class="book-card">
            <img [src]="'http://localhost:3001' + b.image" alt="book cover" />
            <h4>{{ b.title }}</h4>
            <p>by {{ b.author }}</p>
            <p>Return by: {{ getRentUntil(b) | date:'mediumDate' }}</p>
          </div>
          <div *ngIf="data.rented.length === 0" class="no-books">No rented books yet.</div>
        </div>
      </div>

      <button (click)="logout()" class="logout-btn">Logout</button>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .user-info {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .books-section {
      margin-bottom: 30px;
    }
    .books-section h3 {
      color: #333;
      margin-bottom: 15px;
    }
    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .book-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .book-card img {
      width: 100px;
      height: 150px;
      object-fit: cover;
      margin-bottom: 10px;
    }
    .no-books {
      grid-column: 1 / -1;
      text-align: center;
      color: #666;
      font-style: italic;
    }
    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .logout-btn:hover {
      background: #c82333;
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  userStore = inject(UserInfoStore);
  api = inject(BooksService);
  router = inject(Router);
  data: any = { published: [], bought: [], rented: [] };
  private routerSub: Subscription | null = null;

  async ngOnInit() {
    await this.loadData();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  async loadData() {
    this.data = await this.api.getMyBooks();
  }

  logout() {
    this.userStore.logout();
    this.router.navigate(['/login']);
  }

  getRentUntil(book: any): Date | null {
    const userId = this.userStore.user()?._id;
    const rent = book.rentedBy.find((r: any) => r.user === userId);
    if (!rent) return null;
    const rentUntil = new Date(rent.rentUntil);
    const now = new Date();
    if (rentUntil < now) {
      // Update to current date + 7 days
      const newDate = new Date(now);
      newDate.setDate(now.getDate() + 7);
      return newDate;
    }
    return rentUntil;
  }
}