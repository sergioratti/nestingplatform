import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest } from '@angular/common/http';
import {pieces} from './pieces'
import {sheets} from './sheets'

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

  getPieces(){
    return pieces;
  }

  getSheets(params:{ids?:number[],type_id?:number}):Promise<any>{

    var sheetsDB = [];
    if(params.ids){
      sheetsDB = sheets.filter(item=>{return params.ids.indexOf(item.id)>-1});
    }
    else if(params.type_id){
      sheetsDB = sheets.filter(item=>{return item.Type.id === params.type_id});
    }
    else
      sheetsDB = sheets;
    

    return Promise.resolve(sheetsDB)
    
    
  }


}
