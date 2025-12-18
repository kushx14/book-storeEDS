import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserInfoStore } from '../../store/user-info.store';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{ isLogin ? 'Book Store Login' : 'Book Store Sign Up' }}</h2>

        <form class="auth-form" (submit)="onSubmit($event)">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" placeholder="Enter your email" required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" class="auth-btn">
            {{ isLogin ? 'Login' : 'Sign Up' }}
          </button>
        </form>

        <p class="error" *ngIf="error">{{ error }}</p>

        <p class="toggle-text">
          {{ isLogin ? 'Don\'t have an account?' : 'Already have an account?' }}
          <button type="button" (click)="toggleMode()" class="toggle-btn">{{ isLogin ? 'Sign Up' : 'Login' }}</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #FFFACD 0%, #FFE4B5 100%); /* Lemon yellow gradient */
      padding: 20px;
    }
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
    .auth-card h2 {
      margin-bottom: 30px;
      color: #333;
      font-size: 24px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-group {
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #8A2BE2;
      box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.2);
    }
    .auth-btn {
      background: linear-gradient(to right, #8A2BE2, #4B0082);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s;
    }
    .auth-btn:hover {
      transform: translateY(-2px);
    }
    .error {
      color: #dc3545;
      margin-top: 10px;
      font-weight: bold;
    }
    .toggle-text {
      margin-top: 20px;
      color: #666;
    }
    .toggle-btn {
      background: none;
      border: none;
      color: #8A2BE2;
      cursor: pointer;
      font-weight: bold;
      text-decoration: underline;
    }
    .toggle-btn:hover {
      color: #4B0082;
    }
  `]
})
export class LoginComponent {
  error = '';
  isLogin = true;
  store = inject(UserInfoStore);
  router = inject(Router);

  onSubmit(event: Event) {
    event.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    if (this.isLogin) {
      this.login(email, password);
    } else {
      this.signup(email, password);
    }
  }

  async login(email: string, password: string) {
    try {
      this.error = '';
      await this.store.login(email, password);
      this.router.navigate(['/library']);
    } catch (e: any) {
      this.error = e.message;
    }
  }

  async signup(email: string, password: string) {
    try {
      this.error = '';
      await this.store.signup(email, password);
      this.router.navigate(['/library']);
    } catch (e: any) {
      this.error = e.message;
    }
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }
}