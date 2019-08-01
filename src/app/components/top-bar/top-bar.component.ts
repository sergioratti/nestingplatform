import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

@Output('onChoose') onChoose:EventEmitter<any> = new EventEmitter<any>();

  kerf:number = 5;
  guillotine:boolean = true;
  sheetWidth:number = 3050;
  sheetHeight:number = 1600;
  time:number = 30;

  constructor() { }

  ngOnInit() {
  }

  onClick(){
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

}
