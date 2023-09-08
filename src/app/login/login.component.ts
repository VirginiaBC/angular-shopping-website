import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  token: string | null = null;
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  login() {
    this.errorMessage = '';
    const loginData = {
      username: this.username,
      password: this.password,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.http
      .post<any>('https://fakestoreapi.com/auth/login', loginData, httpOptions)
      .subscribe(
        (response) => {
          if (response && response.token) {
            this.token = response.token;
            console.log('Login successful. Token:', this.token);

            this.getUserID();

            localStorage.setItem('token', this.token);

            this.isLoggedIn = true;
            this.router.navigate(['/product-list']);
          } else {
            this.errorMessage = 'Login fail, check your email or password';
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login fail, check your email or password';
        }
      );
  }

  getUserID() {
    this.http
      .get('https://fakestoreapi.com/users')
      .subscribe((usersData: any[]) => {
        const user = usersData.find((user) => user.username === this.username);
        if (user) {
          const userId = user.id;
          console.log('UserID:', userId);
          localStorage.setItem('userId', userId);
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;

    this.router.navigate(['/login']);
  }
}
