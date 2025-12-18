import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksStore } from '../../store/books.store';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-book-container">
      <h2>Add New Book</h2>

      <form (ngSubmit)="submit()" class="book-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" [(ngModel)]="book.title" name="title" placeholder="Enter book title" required />
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input id="author" [(ngModel)]="book.author" name="author" placeholder="Enter author name" required />
        </div>

        <div class="form-group">
          <label for="image">Book Cover Image</label>
          <input type="file" id="image" (change)="onFileSelected($event)" name="image" accept="image/*" />
        </div>

        <div class="form-group">
          <label for="copies">Copies Available</label>
          <input type="number" id="copies" [(ngModel)]="book.copiesAvailable" name="copiesAvailable" placeholder="Number of copies" min="1" required />
        </div>

        <div class="form-group">
          <label for="overview">Overview</label>
          <textarea id="overview" [(ngModel)]="book.overview" name="overview" placeholder="Brief description of the book" rows="4"></textarea>
        </div>

        <button type="submit" class="submit-btn">Add Book</button>
      </form>
    </div>
  `,
  styles: [`
    .add-book-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .book-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    input[type="file"] {
      padding: 5px;
    }
    textarea {
      resize: vertical;
    }
    .submit-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }
    .submit-btn:hover {
      background: #0056b3;
    }
  `]
})
export class AddBookComponent {
  store = inject(BooksStore);
  router = inject(Router);

  book = {
    title: '',
    author: '',
    overview: '',
    copiesAvailable: 1
  };

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async submit() {
    await this.store.addBook(this.book, this.selectedFile);
    this.router.navigate(['/library']);
  }
}