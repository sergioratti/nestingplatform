import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiRoot:string = 'http://localhost:3000/api';
  private httpOptions:any = {
  }

  constructor(private http:HttpClient) { }

  nest(data){
    // data :{
    //   kerf:number, 
    //   guillotine:number,//(0/1) 
    //   sheetWidth:number, 
    //   sheetHeight:number,
    //   time:number,
    //   pieces:{
    //     name:string,
    //     w:number,
    //     h:number}[]
    //   }
    return this.http.post(this.apiRoot + `/nesting/nest`,data,this.httpOptions);
  }
}
