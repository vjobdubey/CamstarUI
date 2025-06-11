import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    if(this.auth.getUsername()){
      this.router.navigate(['/reports']);
    }
    
  }

  onLogin() {
    const success = this.auth.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/reports']);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
