import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/@core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    protected fb: FormBuilder,
    private authService: AuthService,
    private jwtHelperService: JwtHelperService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((res) => {
        localStorage.setItem('accessToken', res.token);
        const decodedToken = this.jwtHelperService.decodeToken(res.token);
        this.authService.redirectUser(decodedToken.role);
      });
    }
  }
}
