import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { PatientComponent } from '../patient/patient.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  menus: Menu[];

  constructor(
    private loginService: LoginService,
    private menusService: MenuService
  ){

  }
  ngOnInit(): void {
    this.menusService.getMenuChange().subscribe(data => this.menus = data);
  }

  logout(){
    this.loginService.logout();

  }

}
