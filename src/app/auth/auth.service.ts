import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: { username: string; role: string } | null = null;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
  }

  login(username: string, password: string): boolean {
    // Simple mock: match credentials to roles
    if (username === 'op' && password === '123') {
      this.setUser({ username, role: 'operation' });
      return true;
    }
    if (username === 'trader' && password === '123') {
      this.setUser({ username, role: 'trader' });
      return true;
    }
    return false;
  }

  private setUser(user: { username: string; role: string }) {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getRole(): string | null {
    return this.currentUser?.role || null;
  }

  getUsername(): string | null {
    return this.currentUser?.username || null;
  }
}

