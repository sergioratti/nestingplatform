import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { type } from 'os';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

@Output('onChoose') onChoose:EventEmitter<any> = new EventEmitter<any>();

  kerf:number = 5;
  guillotine:number = 1;
  sheetWidth:number = 3050;
  sheetHeight:number = 1600;
  time:number = 30;
  sheets:any[] = [] ;
  types:any[] = [] ;
  selectedType:any;
  guillotineValues:{label:string,value:number}[] = [{label:'Yes',value:1},{label:'No',value:0}];

  constructor(private data:DataService) { 
  }

  ngOnInit() {
    this.data.getSheets({})
    .then(sheets=>{
      this.sheets = sheets;
      this.sheets.forEach(item=>{
        var index = this.types.findIndex(type=>{return type.id === item.Type.id;});
        if(index === -1)
          this.types.push(item.Type);
      })
    })
    .catch(error=>{
      this.sheets = [];
      this.types = [];
    })
  }

  onClick(){
    if(this.selectedType){
      var type:any[] = this.types.filter(t=>{return t.id === this.selectedType});
      if(type.length>0){
        this.sheetWidth = type[0].width;
        this.sheetHeight = type[0].height;
      }
      else
        return ;
    }
    else
      return ;
    this.onChoose.emit(
      {
        kerf:this.kerf, 
        guillotine:this.guillotine, 
        sheetWidth:this.sheetWidth, 
        sheetHeight:this.sheetHeight,
        time:this.time
      }
    );
  }

  getTypeDescription(type:any){
    return `${type.width}x${type.height}`;
  }

  changingValue($event){
    console.log($event);
  }

}
