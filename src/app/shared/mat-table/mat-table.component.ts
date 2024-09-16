import { Component, ContentChild, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-mat-table',
  standalone: true,
  imports: [MaterialModule, NgTemplateOutlet],
  templateUrl: './mat-table.component.html',
  styleUrl: './mat-table.component.css'
})
export class MatTableComponent implements OnInit {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 25];  
  
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ContentChild(TemplateRef) customTemplate: TemplateRef<any>; 

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.def);
    this.dataSource = new MatTableDataSource(this.data);
  }

  //se ejecuta varias veces, cada vez que una propiedad de entrada cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Actualiza el dataSource cuando los datos cambian
      this.dataSource = new MatTableDataSource(this.data);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  //solo se ejecuta una vez, después de que toda la vista y los hijos del componente han sido inicializados
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
