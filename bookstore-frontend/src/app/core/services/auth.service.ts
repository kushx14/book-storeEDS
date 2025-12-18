import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:3001/api/auth';

  async login(email: string, password: string) {
    const res = await fetch(`${this.API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    return res.json();
  }

  async signup(email: string, password: string) {
    const res = await fetch(`${this.API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }

    return res.json();
  }
}