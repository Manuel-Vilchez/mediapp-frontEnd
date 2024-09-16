import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Speciality } from '../../model/speciality';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SpecialityService } from '../../services/speciality.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-speciality',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './speciality.component.html',
  styleUrl: './speciality.component.css'
})
export class SpecialityComponent implements OnInit{


  dataSource: MatTableDataSource<Speciality>;
  columnsDefinition = [
    { def: 'idSpeciality', label: 'idSpeciality', hide: true},
    { def: 'nameSpeciality', label: 'nameSpeciality', hide: false},
    { def: 'descriptionSpeciality', label: 'descriptionSpeciality', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private specialityService: SpecialityService,
    private route: ActivatedRoute
  ){

  }

  ngOnInit(): void {
    this.specialityService.findAll().subscribe(data => this.createTable(data));
    this.specialityService.getSpecialityChange().subscribe(data => this.createTable(data));

  }

  getDisplayedColumns():string[]{
    return this.columnsDefinition.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();
  }

  createTable(data: Speciality[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  delete(idSpeciality: number){
    this.specialityService.delete(idSpeciality)
    .pipe(switchMap( ()=> this.specialityService.findAll() ))
    .subscribe(data => {
      this.specialityService.setSpecialityChange(data);
      this.specialityService.setMessageChange('DELETED!');
    });

  }

  checkChildren(){
    return this.route.children.length > 0;

  }

}
