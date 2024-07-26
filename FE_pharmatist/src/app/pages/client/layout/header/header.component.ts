import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/@core/service/auth.service';

@Component({
  selector: 'app-client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  checkRoleToken: string = 'user';
  isLogged: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLogged = this.authService.isLoggedIn();
    const decodedToken = this.authService.decodeToken();
    this.checkRoleToken = decodedToken ? decodedToken.role : 'user';
  }
  logout() {
    this.authService.logout();
  }
}
