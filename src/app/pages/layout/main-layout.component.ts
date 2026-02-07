import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
    }
  }

  logout() {
    this.authService.logout();
  }
}