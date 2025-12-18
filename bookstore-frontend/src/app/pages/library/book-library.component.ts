import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BooksStore } from '../../store/books.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="library-container">
      <h2>Book Library</h2>

      <p *ngIf="store.loading()" class="loading">Loading books...</p>

      <ng-container *ngIf="store.allBooks() as books">
        <div class="grid" *ngIf="books.length > 0; else noBooks">
          <div
            class="card"
            *ngFor="let book of books"
            (click)="openBook(book._id)"
          >
            <img [src]="'http://localhost:3001' + book.image" alt="book cover" />
            <div class="card-content">
              <h3>{{ book.title }}</h3>
              <p>by {{ book.author }}</p>
              <span *ngIf="book.copiesAvailable === 0" class="badge unavailable">Not Available</span>
              <span *ngIf="book.copiesAvailable > 0" class="badge available">{{ book.copiesAvailable }} Available</span>
            </div>
          </div>
        </div>
        <ng-template #noBooks>
          <p class="no-books">No books available in the library.</p>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [`
    .library-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .loading {
      text-align: center;
      color: #666;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      background: white;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card-content {
      padding: 15px;
      text-align: center;
    }
    .card-content h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .card-content p {
      margin: 5px 0;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    .available {
      background-color: #4CAF50;
      color: white;
    }
    .unavailable {
      background-color: #f44336;
      color: white;
    }
    .no-books {
      text-align: center;
      color: #666;
      font-style: italic;
      grid-column: 1 / -1;
    }
  `]
})
export class BookLibraryComponent implements OnInit {
  store = inject(BooksStore);
  router = inject(Router);

  ngOnInit() {
    this.store.loadBooks();
  }

  openBook(id: string) {
    this.router.navigate(['/books', id]);
  }
}