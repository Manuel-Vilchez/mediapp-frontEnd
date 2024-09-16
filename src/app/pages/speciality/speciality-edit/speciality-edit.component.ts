import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpecialityService } from '../../../services/speciality.service';
import { Speciality } from '../../../model/speciality';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-speciality-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './speciality-edit.component.html',
  styleUrl: './speciality-edit.component.css'
})
export class SpecialityEditComponent implements OnInit{

  id: number;
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specialityService: SpecialityService
  ){

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      idSpeciality: new FormControl(0),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.isEdit){
      this.specialityService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idSpeciality: new FormControl(data.idSpeciality),
          name: new FormControl(data.nameSpeciality, [Validators.required, Validators.minLength(3)]),
          description: new FormControl(data.descriptionSpeciality, [Validators.required, Validators.minLength(3)]),
        });
      });
    }
  }

  operate(){
    const speciality: Speciality = new Speciality();
    speciality.idSpeciality = this.form.value['idSpeciality'];
    speciality.nameSpeciality = this.form.value['name'];
    speciality.descriptionSpeciality = this.form.value['description'];
    
    if(this.isEdit){
      //UPDATE
      //PRACTICA COMUN PERO NO IDEAL
      this.specialityService.update(this.id, speciality).subscribe(()=> {
        this.specialityService.findAll().subscribe(data => {
          this.specialityService.setSpecialityChange(data);
          this.specialityService.setMessageChange('UPDATED!');
        });
      });

    }else{
      //INSERT
      this.specialityService
        .save(speciality)
        .pipe(switchMap(() => this.specialityService.findAll()))
        .subscribe(data => {
          this.specialityService.setSpecialityChange(data);
          this.specialityService.setMessageChange('CREATED!');
        });

    }

    this.router.navigate(['/pages/speciality']);

  }

  get f(){
    return this.form.controls;
  }

}
