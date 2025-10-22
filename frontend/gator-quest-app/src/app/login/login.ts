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
    if (this.username === 'admin' && this.password === 'admin') {
      // TODO: replace with a real auth service later
      localStorage.setItem('loggedIn', 'true');
      this.router.navigate(['/home']);
    } 
    else {
      const creds = {
      email: this.username,
      password: this.password
    };
      this.http.post('http://localhost:5000/api/users/login', creds)
        .subscribe({
          next: (res) => {
            localStorage.setItem('loggedIn', 'true');
            this.router.navigate(['/home']);
          },
          error: (err) => {
            alert('Invalid credentials!');
          }
        });
    }
  }
  createAccount(){
    this.router.navigate(['/signup']);
  }
}
