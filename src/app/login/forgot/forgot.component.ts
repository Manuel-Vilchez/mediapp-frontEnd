import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [MaterialModule, FormsModule, RouterOutlet, RouterLink, ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent {

  email: string;
  message: string;
  error: string;

  
  constructor(
    private loginService: LoginService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  sendMail() {
    this.loginService.sendMail(this.email).subscribe(data => {
      if (data === 1) {
        this.message = "Mail sent!"
        this.error = null
      } else {
        this.error = "User not exists";
      }
    });
  }


}
