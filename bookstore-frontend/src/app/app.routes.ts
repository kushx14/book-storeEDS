import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './core/layout/app-layout.component';
import { BookLibraryComponent } from './pages/library/book-library.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AddBookComponent } from './pages/add-book/add-book.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/library', pathMatch: 'full' },
      { path: 'library', component: BookLibraryComponent },
      { path: 'books/:id', component: BookDetailsComponent },
      { path: 'add-book', component: AddBookComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'cart', component: CartComponent }
    ]
  }
];
