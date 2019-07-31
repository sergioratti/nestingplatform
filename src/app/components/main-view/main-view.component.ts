import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as konva from 'konva'
import {pieces} from './pieces'

@Component({
  selector: 'main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  private stage:any;
  private layer:any;

  @ViewChild('container') container:ElementRef;

  constructor() { }

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
          scale:{x:0.2,y:-0.2}
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
          this.destroy();
          self.layer.draw();
        });

        box.on('mouseover', function() {
          document.body.style.cursor = 'pointer';
        });
        box.on('mouseout', function() {
          document.body.style.cursor = 'default';
        });

        this.layer.add(box);
      });

      // add the layer to the stage
      this.stage.add(this.layer);
  }

}
