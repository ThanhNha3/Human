import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { AuthService } from 'src/app/@core/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (
      state.url === '/' ||
      state.url.startsWith('/xac-nhan-thong-tin') ||
      state.url.startsWith('/thong-ke')
    ) {
      return true;
    }

    const token = this.authService.getAccessToken();

    if (!token || this.authService.isAccessTokenExpired()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const decodedToken = this.authService.decodeToken();
    const userRole = decodedToken.role;
    // Kiểm tra quyền truy cập dựa trên role và URL
    return this.checkRoleAccess(userRole, state.url);
  }

  private checkRoleAccess(role: string, url: string): boolean {
    // Cho phép truy cập vào trang chủ mà không cần kiểm tra role
    if (url === '/') {
      return true;
    }

    // Kiểm tra quyền truy cập dựa trên role và URL
    switch (role) {
      case 'admin':
        if (url.startsWith('/admin')) {
          return true;
        }
        break;
      case 'doctor':
        if (url.startsWith('/bac-si')) {
          return true;
        }
        break;
      case 'pharmartist':
        if (url.startsWith('/duoc-si')) {
          return true;
        }
        break;
      case 'user':
        if (url.startsWith('/')) {
          return true;
        }
        break;
      default:
        break;
    }

    this.router.navigate(['/']);
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state);
  }
}
