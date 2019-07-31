import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as konva from 'konva'
import {pieces} from './pieces'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  private stage:any;
  private layer:any;
  private boxes:konva.default.Path[];
  private scale:number = 0.2;

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
        pieces:this.boxes.map((box,index)=>{ var bounds = box.getClientRect({});return {type:1,name:`P${index}`, points:[[0,0],[bounds.width/this.scale,bounds.height/this.scale]]};})
       }

      this.data.nest(params).toPromise()
      .then(results=>{
        console.log(results);
        if(Array.isArray(results['pieces'])){
          results['pieces'].forEach(r=>{
            var box = this.boxes[Number(r.name.replace('P',''))];
            if(r.rot === 90)
              box.rotate(r.rot);
          });
        }
      })
    }
      
  }

  constructor(private data:DataService) {
    this.boxes = [];
  }

  ngOnInit() {
    var self = this;
    console.log(this.container);
    this.stage = new konva.default.Stage({
      container: 'container2',
      width: window.innerWidth,
      height: window.innerHeight
    })
    this.layer = new konva.default.Layer();

    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

      pieces.forEach((p,i)=>{
        var box = new konva.default.Path({
          x: i * 30 + 50,
          y: i * 18 + 500,
          fill: colors[i],
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
          data:p.svg,
          scale:{x:self.scale,y:-self.scale},
          name:`${p.id}`
        });

        box.on('dragstart', function() {
          // this.moveToTop();
          this.layer.draw();
        }.bind(this));

        box.on('dragmove', function() {
          document.body.style.cursor = 'pointer';
        });
        /*
         * dblclick to remove box for desktop app
         * and dbltap to remove box for mobile app
         */
        box.on('dblclick dbltap', function() {
          //this.destroy();
          self.layer.draw();
        });

        box.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
        });
        box.on('mouseout', function() {
          document.body.style.cursor = 'default';
        });

        this.boxes.push(box);
        this.layer.add(box);
      });

      // add the layer to the stage
      this.stage.add(this.layer);
  }

}
