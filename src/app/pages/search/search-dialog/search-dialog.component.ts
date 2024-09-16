import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consult } from '../../../model/consult';
import { MaterialModule } from '../../../material/material.module';
import { DatePipe } from '@angular/common';
import { ConsultService } from '../../../services/consult.service';
import { Exam } from '../../../model/exam';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [MaterialModule, DatePipe],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.css'
})
export class SearchDialogComponent implements OnInit{

  consult: Consult;
  exams: Exam[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Consult,
    private consultService: ConsultService
  ){}

  ngOnInit(): void {
      this.consult = { ... this.data};
      this.consultService.getExamsByIdConsult(this.consult.idConsult).subscribe(data => this.exams = data);
  }
}
