import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

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
  constructor(private router: Router) {}
  createdAccount(){
    this.router.navigate(['/login']);
  }
}
