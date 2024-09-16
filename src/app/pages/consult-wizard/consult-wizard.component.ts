import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../model/patient';
import { PatientService } from '../../services/patient.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ConsultDetail } from '../../model/consultDetail';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../model/exam';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Medic } from '../../model/medic';
import { MedicService } from '../../services/medic.service';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { MatStepper } from '@angular/material/stepper';
import { ConsultListExamDTOI } from '../../model/consultListExamDTOI';
import { Consult } from '../../model/consult';
import { format } from 'date-fns';
import { ConsultService } from '../../services/consult.service';

@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, FlexLayoutModule],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css'
})
export class ConsultWizardComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  patients: Patient[];
  patients$: Observable<Patient[]>;

  minDate: Date = new Date();
  details: ConsultDetail[] = [];
  exams: Exam[];
  examsFiltered$: Observable<Exam[]>;
  examControl: FormControl = new FormControl();
  examsSelected: Exam[] = [];
  medics: Medic[];
  medicSelected: Medic;

  consultArray: number[] = [];
  consultSelected: number;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private examService: ExamService,
    private _snackBar: MatSnackBar,
    private medicService: MedicService,
    private consultService: ConsultService
  ) {

  }

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      patient: [new FormControl(), Validators.required],
      consultDate: [new FormControl(new Date()), Validators.required],
      exam: [this.examControl, Validators.required],
      diagnosis: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
    });

    this.secondFormGroup = this.formBuilder.group({});

    this.examsFiltered$ = this.examControl.valueChanges.pipe(
      map(val => this.filterExams(val)))

    this.loadInitialData();
  }

  getDate(e: any) {
    console.log(e.value);
  }

  addDetail() {
    const det = new ConsultDetail();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number) {
    this.details.splice(index, 1);

  }

  loadInitialData() {
    this.patients$ = this.patientService.findAll();
    this.examService.findAll().subscribe(data => this.exams = data);
    this.medicService.findAll().subscribe(data => this.medics = data);

    for(let i = 1; i <= 100; i++){
      this.consultArray.push(i);
    }
  }

  filterExams(val: any) {
    if (val?.idExam > 0) {
      return this.exams.filter(
        (el) =>
        el.nameExam.toLowerCase().includes(val.nameExam.toLowerCase()) || 
        el.descriptionExam
        .toLowerCase()
        .includes(val.descriptionExam.toLowerCase())
      );
    } else {
      return this.exams.filter(
        (el) =>
        el.nameExam.toLowerCase().includes(val?.toLowerCase()) || 
        el.descriptionExam.toLowerCase().includes(val?.toLowerCase())
      );
    }
  }

  showExam(val: any) {
    return val ? val.nameExam : val;
  }

  addExam() {
    const tmpExam: Exam = this.firstFormGroup.value['exam'].value;

    if (tmpExam != null) {
      if (this.examsSelected.length > 0) {
        for (let i = 0; i < this.examsSelected.length; i++) {
          const exam = this.examsSelected[i];
          if (exam.idExam == tmpExam.idExam) {
            this._snackBar.open('Exam already in list', 'INFO', {
              duration: 2000,
            });
            break;
          } else {
            this.examsSelected.push(tmpExam);
          }
        }
      } else {
        this.examsSelected.push(tmpExam);
      }
    } else {
      this._snackBar.open('Please select an exam', 'INFO', { duration: 2000 });
    }
  }

  selectMedic(m: Medic){
    this.medicSelected = m;
  }

  selectedConsult(n: number){
    this.consultSelected = n;
  }

  nextManualStep(){
    if (this.consultSelected > 0) {
      //next step
      this.stepper.next();
    }else{
      this._snackBar.open('Please select a consult number', 'INFO', {duration: 2000})
    }
  }

  get f(){
    return this.firstFormGroup.controls;
  }

  save(){
    const consult = new Consult();
    consult.patient = this.firstFormGroup.value['patient'];
    consult.medic = this.medicSelected;
    consult.details = this.details;
    consult.numConsult = `C${this.consultSelected}`;
    consult.consultDate = format(this.firstFormGroup.value['consultDate'], "yyyy-MM-dd'T'HH:mm:ss");
    consult.idUser = 1;

    const dto: ConsultListExamDTOI = {
      consult: consult,
      lstExam: this.examsSelected
    }

    this.consultService.saveTransactional(dto).subscribe( ()=> {
      this._snackBar.open('CREATED!', 'INFO', { duration: 2000 });

      setTimeout( () => {
        this.cleanControls();
      }, 2000 );
    });
  }

  cleanControls(){
    this.firstFormGroup.reset();
    this.stepper.reset();
    this.details = [];
    this.examsSelected = [];
    this.consultSelected = 0;
    this.medicSelected = null;
  }

}
