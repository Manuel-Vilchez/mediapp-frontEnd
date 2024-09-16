import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { Medic } from '../../../model/medic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpecialityService } from '../../../services/speciality.service';
import { Speciality } from '../../../model/speciality';
import { MedicService } from '../../../services/medic.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-medic-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css'
})
export class MedicDialogComponent implements OnInit{

  medic: Medic;
  specialities: Speciality[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Medic,
    private specialityService: SpecialityService,
    private medicService: MedicService,
    private _dialogRef: MatDialogRef<MedicDialogComponent>
  ){

  }
  ngOnInit(): void {
    this.medic = { ...this.data };
    //this.medic = this.data;
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.idSpeciality = this.data.idSpeciality;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.photo = this.data.photo;*/

    this.specialityService.findAll().subscribe(data => this.specialities = data);
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if (this.medic != null && this.medic.idMedic > 0) {
      //UPDATE
      this.medicService.update(this.medic.idMedic, this.medic)
      .pipe(switchMap( ()=> this.medicService.findAll() ))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('UPDATED!')
      });
    }else{
      //INSERT
      this.medicService.save(this.medic)
      .pipe(switchMap( ()=> this.medicService.findAll() ))
      .subscribe(data => {
        this.medicService.setMedicChange(data);
        this.medicService.setMessageChange('CREATED!')
      });
    
    }

    this.close();

  }

}
