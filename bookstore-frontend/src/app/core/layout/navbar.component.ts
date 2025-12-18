import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/library">Library</a>
      <a routerLink="/add-book">Add Book</a>
      <a routerLink="/profile">Profile</a>
      <a routerLink="/cart">Cart ({{ cart.totalItems() }})</a>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      gap: 20px;
      padding: 16px;
      background: linear-gradient(to right, #8A2BE2, #4B0082); /* Violet to purple gradient */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;
    }
    a:hover {
      color: #FFD700; /* Gold on hover */
    }
  `]
})
export class NavbarComponent {
  cart = inject(CartStore);
}