import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, PasswordModule, InputTextModule, ButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
  const creds = {
    email: this.username,
    password: this.password
  };

  this.http.post('http://localhost:5000/api/users/login', creds)
    .subscribe({
      next: (res: any) => {
        alert(res.message || 'Login successful!');
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('playerName', this.username);
        localStorage.setItem('token', res.token);
        const username = res.user.email;
        const role = res.user.role;
        console.log('User logged in:', res);

        // Route based on role
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          // Fetch player for regular users
          this.http.get(`http://localhost:5000/api/players/byName/${username}`)
            .subscribe({
              next: (player: any) => {
                localStorage.setItem('playerId', player._id); 
                this.router.navigate(['/home']);
              },
              error: (err) => {
                console.error('Failed to fetch player:', err);
              }
            });
        }
      },
      error: (err) => {
        const backendMsg = err.error?.message || 'Login failed. Please try again.';
        alert(backendMsg);
      }
    });
}
  createAccount(){
    this.router.navigate(['/signup']);
  }
}
