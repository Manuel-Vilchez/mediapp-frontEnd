import { Injectable } from '@angular/core';
import { VitalSign } from '../model/vitalSign';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignsService extends GenericService<VitalSign>{


  private vitalSignChange: Subject<VitalSign[]> = new Subject<VitalSign[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/vitalSigns`);
   }

      ////////////////////////////
      setVitalSignChange(data: VitalSign[]){
        this.vitalSignChange.next(data);
       }
    
       getVitalSignChange(){
        return this.vitalSignChange.asObservable();
       }
    
       setMessageChange(data: string){
        this.messageChange.next(data);
       }
    
       getMessageChange(){
        return this.messageChange.asObservable();
       }


}
