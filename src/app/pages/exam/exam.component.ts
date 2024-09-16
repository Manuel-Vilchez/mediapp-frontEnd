import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableComponent } from '../../shared/mat-table/mat-table.component';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [MaterialModule, MatTableComponent],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exams: Exam[] = [];
  columnsDefinitions = [
    { def: 'idExam', label: 'ID' },
    { def: 'nameExam', label: 'Name' },
    { def: 'descriptionExam', label: 'Description' },    
    { def: 'actions', label: 'Actions' }
  ];

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.examService.findAll().subscribe(data => {
      this.exams = data;
    });
  }

  edit(idExam: number) {
    // Lógica para editar examen
  }

  delete(idExam: number) {
    // Lógica para eliminar examen
  }
}