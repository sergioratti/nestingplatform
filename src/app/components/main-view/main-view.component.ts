import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import {PaperScope,Path,Point as PaperPoint,Color as PaperColor, CompoundPath} from 'paper'
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  @Input('sheetsParams') sheetsParams:any;
  private boxes:any[];
  private sheets:any[];
  private scale:number = 0.2;
  private sheetWidth:number = 3050;
  private sheetHeight:number = 1650;
  private scope:PaperScope;
  private dragging:boolean;
  private selectedPath:CompoundPath;
  private lastPoint:PaperPoint;
  

  @ViewChild('container') container:ElementRef;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    
    if(event.shiftKey === true && event.code === 'KeyN'){
     this.doNest()
    }
      
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWhhel(event) {
    
    if(event.wheelDelta>0){
      this.scope.view.scaling.x *= 1.1;
      this.scope.view.scaling.y *= 1.1;
    }
    else if(event.wheelDelta<0){
      this.scope.view.scaling.x *= 0.9;
      this.scope.view.scaling.y *= 0.9;
    }
      
  }


  constructor(private data:DataService,private toastr:ToastrService) {
    this.boxes = [];
    this.sheets = [];
    this.dragging = false ;
    this.selectedPath = null;
    this.lastPoint = null;
  }

  ngOnChanges(){
    if(this.sheetsParams && Object.keys(this.sheetsParams).length>0)
    this.doNest();
  }

  ngOnInit() {
    var self = this;
    this.scope = new PaperScope();
    this.scope.setup('container2');
    this.scope.view.scaling = new PaperPoint(this.scale,-this.scale);
    this.scope.view.onMouseDrag = function(event){
      self.boxes.forEach(b=>{
        b.position.x += event.delta.x;
        b.position.y += event.delta.y;
      })
      self.sheets.forEach(b=>{
        b.position.x += event.delta.x;
        b.position.y += event.delta.y;
      })
      
    }
    
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

      this.data.getPieces().forEach((p,i)=>{

        var box = new CompoundPath(p.svg);
        box.name = `P${p.id}`;
        box.fillColor = new PaperColor(colors[i]);
        box.strokeColor = new PaperColor('black');
        

        box.onMouseDrag = function(event) {
          this.position.x += event.delta.x;
          this.position.y += event.delta.y;
          event.stopPropagation()
      }
        

        this.boxes.push(box);

      });

      // add the layer to the stage
  }

  public updatePositions(res:any){
      // nesting library calculates rotation around the bototm left point
      var dispositions:{name:string,sheet:number,x:number,y:number,rotation:number}[] = [] ;
      (res.pieces||[]).forEach(p=>{
           dispositions.push({name:p.name,sheet:p.sheet,x:p.x,y:p.y,rotation:p.rot});
      });
      
      var dispo = {sheets:res['sheets'],disposition:dispositions};

      this.sheets.forEach((sheet:Path)=>{
        sheet.remove();
      });
      
      for(var i=0;i<dispo.sheets;i++){
        var p = new Path.Rectangle(new PaperPoint(i*(this.sheetWidth+10),0),new PaperPoint((i+1)*(this.sheetWidth+10),this.sheetHeight))
        p.strokeWidth = 2;
        p.strokeColor = new PaperColor('black');
        this.sheets.push(p);
      }

       this.boxes.forEach((bo:CompoundPath)=>{
         var curDispo = dispo.disposition.filter(d=>{return d.name === bo.name });
         if(curDispo.length === 0)
           return ;

         if(curDispo[0].x === undefined || curDispo[0].y === undefined)
           return ;
         
         var newBLPoint:number[] = [curDispo[0].x,curDispo[0].y] ;
         var bounds = bo.bounds;
         var minX = Math.min(bounds.left,bounds.right);
         var minY = Math.min(bounds.bottom,bounds.top);
         var transX = (newBLPoint[0] + (curDispo[0].sheet-1)*(this.sheetWidth+10)) - minX;
         var transY = newBLPoint[1] - minY;
         bo.translate(new PaperPoint(transX,transY));
         
         var originalPoint:any;
         if(curDispo[0].rotation > 0){

           var minP = {x:bounds.x,y:bounds.y} ;
           //rotate around the application point
           bo.rotate(curDispo[0].rotation,new PaperPoint(curDispo[0].x,curDispo[0].y));
         }
       })
  }

  doNest(){
    var params ={
      ...this.sheetsParams,
      pieces:this.boxes.map((box:CompoundPath,index)=>{ var bounds = box.bounds;return {type:1,name:box.name, points:[[0,0],[bounds.width,bounds.height]]};})
     }

    this.data.nest(params).toPromise()
    .then(results=>{
      console.log(results);
      if(Array.isArray(results['pieces'])){
        this.updatePositions(results);        
      }
      this.toastr.success('Nested!')
    })
    .catch(err=>{
      this.toastr.error(err.message)
    })
  }

}
