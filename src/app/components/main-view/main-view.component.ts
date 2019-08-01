import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import {PaperScope,Path,Point as PaperPoint,Color as PaperColor, CompoundPath} from 'paper'
import {pieces} from './pieces'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  private boxes:any[];
  private scale:number = 0.2;
  private sheetWidth:number = 3050;
  private scope:PaperScope;
  private dragging:boolean;
  private selectedPath:CompoundPath;
  private lastPoint:PaperPoint;
  

  @ViewChild('container') container:ElementRef;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    
    if(event.shiftKey === true && event.code === 'KeyN'){
      var params ={
        kerf:5, 
        guillotine:1, 
        sheetWidth:3050, 
        sheetHeight:1600,
        time:30,
        pieces:this.boxes.map((box:CompoundPath,index)=>{ var bounds = box.bounds;return {type:1,name:`P${index}`, points:[[0,0],[bounds.width,bounds.height]]};})
       }

      this.data.nest(params).toPromise()
      .then(results=>{
        console.log(results);
        if(Array.isArray(results['pieces'])){
          this.updatePositions(results);        
        }
      })
    }
      
  }


  constructor(private data:DataService) {
    this.boxes = [];
    this.dragging = false ;
    this.selectedPath = null;
    this.lastPoint = null;
  }

  ngOnInit() {
    var self = this;
    this.scope = new PaperScope();
    this.scope.setup('container2');
    this.scope.view.scaling = new PaperPoint(this.scale,-this.scale);
    
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

      pieces.forEach((p,i)=>{

        var box = new CompoundPath(p.svg);
        box.name = `P${p.id}`;
        box.fillColor = new PaperColor(colors[i]);
        box.strokeColor = new PaperColor('black');
        

        box.onMouseDrag = function(event) {
          this.position.x += event.delta.x;
          this.position.y += event.delta.y;
      }
        

        this.boxes.push(box);

      });

      // add the layer to the stage
  }

  public updatePositions(res:any){
    
      console.log(JSON.stringify(res));
      var dispositions:{name:string,sheet:number,x:number,y:number,rotation:number}[] = [] ;
      (res.pieces||[]).forEach(p=>{
           dispositions.push({name:p.name,sheet:p.sheet,x:p.x,y:p.y,rotation:p.rot});
      });
      
      var dispo = {sheets:res['sheets'],disposition:dispositions};

       this.boxes.forEach((bo:CompoundPath)=>{
         var curDispo = dispo.disposition.filter(d=>{return d.name === bo.name });
         if(curDispo.length === 0)
           return ;

         if(curDispo[0].x === undefined || curDispo[0].y === undefined)
           return ;
         
         var newBLPoint:number[] = [curDispo[0].x,curDispo[0].y] ;
         var bounds = bo.bounds;
         var minX = Math.min(bounds.x,bounds.x+bounds.width);
         var minY = Math.min(bounds.y,bounds.y+bounds.height);
         var transX = (newBLPoint[0] + (curDispo[0].sheet-1)*(this.sheetWidth+10)) - minX;
         var transY = newBLPoint[1] - minY;
         // var transY = (this.sheetHeight - curDispo[0].y) - (bounds.y+bounds.height) ;
         bo.translate(new PaperPoint(transX,transY));
         
         var originalPoint:any;
         if(curDispo[0].rotation > 0){

           var minP = {x:bounds.x,y:bounds.y} ;
           //console.log(JSON.stringify(pOri));
           //rotate around the application point
           bo.rotate(-curDispo[0].rotation,new PaperPoint(curDispo[0].x,curDispo[0].y));
          //  bo.translate(new PaperPoint({x:curDispo[0].x-minP.x + (curDispo[0].sheet-1)*(this.sheetWidth*this.scale+10),y:curDispo[0].y-minP.y}));
         }
       })
      //  this.sheets = dispo.sheets;
  }

}
