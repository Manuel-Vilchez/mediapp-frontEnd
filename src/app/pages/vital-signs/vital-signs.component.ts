import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { VitalSign } from '../../model/vitalSign';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SignsService } from '../../services/signs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitalSignsDialogComponent } from './vital-signs-dialog/vital-signs-dialog.component';
import { Observable, switchMap } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [MaterialModule, RouterLink, DatePipe],
  templateUrl: './vital-signs.component.html',
  styleUrl: './vital-signs.component.css'
})
export class VitalSignsComponent implements OnInit{

  dataSource: MatTableDataSource<VitalSign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private _dialog: MatDialog,
    private vitalSignService: SignsService,
    private _snackBar: MatSnackBar
    ){

  }

  columnsDefinitions = [
    { def: 'vitalSignId', label: 'vitalSignId', hide: false},
    { def: 'date', label: 'date', hide: false},
    { def: 'temperature', label: 'temperature', hide: false},
    { def: 'pulse', label: 'pulse', hide: false},
    { def: 'respiratoryRhythm', label: 'respiratoryRhythm', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ];

  ngOnInit(): void {
    
    this.vitalSignService.findAll().subscribe(data => {
      this.createTable(data)
    });
    
    this.vitalSignService.getVitalSignChange().subscribe(data => this.createTable(data));
    this.vitalSignService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}))
  }

  createTable(data: VitalSign[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //console.log(data);
    
  }

  getDisplayedColumns(){
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  openDialog(vitalSign?: VitalSign){
    this._dialog.open(VitalSignsDialogComponent, {
      width: '750px',
      data: vitalSign,
      disableClose: false
    });

  }

  delete(vitalSignId: number){
    this.vitalSignService.delete(vitalSignId)
    .pipe(switchMap( ()=> this.vitalSignService.findAll() ))
    .subscribe(data => {
      this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('DELETED!')
    })
  }


}
