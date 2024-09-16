import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Speciality } from '../model/speciality';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialityService extends GenericService<Speciality> {

  private specialityChange: Subject<Speciality[]> = new Subject<Speciality[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specialities`);
   }


    //////////////////////////
  setSpecialityChange(data: Speciality[]){
    this.specialityChange.next(data);
  }

  getSpecialityChange(){
    return this.specialityChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

}
