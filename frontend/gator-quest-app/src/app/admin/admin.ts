import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  standalone: true
})
export class Admin implements OnInit {
  players: any[] = [];
  users: any[] = [];
  activeTab: 'players' | 'users' = 'players';
  loading = false;
  error = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPlayers();
    this.loadUsers();
  }

  async loadPlayers() {
    try {
      this.loading = true;
      this.error = '';
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/admin/players', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store' // Force fresh data from server
      });
      if (res.ok) {
        this.players = await res.json();
        console.log('Players refreshed:', this.players);
      } else {
        this.error = 'Failed to load players';
      }
    } catch (err) {
      console.error('Error loading players:', err);
      this.error = 'Error loading players';
    } finally {
      this.loading = false;
    }
  }

  async loadUsers() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store' // Force fresh data from server
      });
      if (res.ok) {
        this.users = await res.json();
        console.log('Users refreshed:', this.users);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  }

  async deletePlayer(id: string) {
    if (!confirm('Delete this player?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/admin/players/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        this.loadPlayers();
      }
    } catch (err) {
      console.error('Error deleting player:', err);
    }
  }

  async deleteUser(id: string) {
    if (!confirm('Delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        this.loadUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('playerId');
    localStorage.removeItem('playerName');
    this.router.navigate(['/login']);
  }

  refreshPlayers() {
    this.loadPlayers();
  }

  refreshUsers() {
    this.loadUsers();
  }
}
