import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(
    private logingService: LoginService,
    private router: Router
  ){

  }

  login(){
    this.logingService.login(this.username, this.password).subscribe(data => {
      //console.log(data)
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/pages/dashboard']);
      
    });

  }

}
