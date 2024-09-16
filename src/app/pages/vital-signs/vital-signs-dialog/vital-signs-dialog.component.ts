import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VitalSign } from '../../../model/vitalSign';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/patient';
import { SignsService } from '../../../services/signs.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-vital-signs-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './vital-signs-dialog.component.html',
  styleUrl: './vital-signs-dialog.component.css'
})
export class VitalSignsDialogComponent implements OnInit{

  date: Date = new Date();

  vitalSign: VitalSign;
  patients: Patient[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: VitalSign,
    private patientService: PatientService,
    private vitalSignService: SignsService,
    private _dialogRef: MatDialogRef<VitalSignsDialogComponent>
  ){}

  ngOnInit(): void {
    this.vitalSign = { ...this.data };
    //this.medic = this.data;
    /*this.vitalSign = new VitalSign();
    this.vitalSign.vitalSignId = this.data.vitalSignId;
    this.vitalSign.idPatient = this.data.idPatient;
    this.vitalSign.date = this.date.toLocaleDateString();
    this.vitalSign.pulse = this.data.pulse;
    this.vitalSign.respiratoryRhythm = this.data.respiratoryRhythm;
    this.vitalSign.temperature = this.data.temperature;*/

    //console.log(this.vitalSign);

    this.patientService.findAll().subscribe(data => this.patients = data);
  }

  close(){
    this._dialogRef.close();
  }

  operate(){
    if (this.vitalSign != null && this.vitalSign.vitalSignId > 0) {
      //UPDATE
      this.vitalSignService.update(this.vitalSign.vitalSignId, this.vitalSign)
      .pipe(switchMap( ()=> this.vitalSignService.findAll() ))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('UPDATED!')
      });
    }else{
      //INSERT
      this.vitalSignService.save(this.vitalSign)
      .pipe(switchMap( ()=> this.vitalSignService.findAll() ))
      .subscribe(data => {
        this.vitalSignService.setVitalSignChange(data);
        this.vitalSignService.setMessageChange('CREATED!')
      });
    
    }

    this.close();

  }

  getDate(date: any) {
    this.data.date = new Date().toDateString();
    console.log(this.date);
  }

}
