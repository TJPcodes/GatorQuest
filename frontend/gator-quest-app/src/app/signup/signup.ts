import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,FormsModule,PasswordModule,InputTextModule,ButtonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  standalone: true,
})
export class Signup {
  firstname = '';
  lastname = '';
  username = '';
  password = '';
  constructor(private router: Router, private http: HttpClient) {}
  createdAccount() {
  const creds = {
    email: this.username,
    password: this.password
  };

  this.http.post('http://localhost:5000/api/users/register', creds)
    .subscribe({
      next: (res: any) => {
        alert(res.message || 'Registration successful!');
        console.log('User registered:', res);
        const userId = res.user._id;
        localStorage.setItem("userId", userId);  
        const newPlayer = {
          name: this.username,
          userId: userId
        };
        
        this.http.post('http://localhost:5000/api/players', newPlayer)
          .subscribe({
            next: (player: any) => {
              console.log("Player created:", player);

              localStorage.setItem("playerId", player._id);

              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error("Player creation failed:", err);
            }
          });

        this.router.navigate(['/login']);
      },

      error: (err) => {
        const backendMsg =
          err.error?.message ||
          'Something went wrong while creating your account. Please try again later.';
        alert(backendMsg);
        console.error('Registration failed:', err);
      }
    });
}
}
