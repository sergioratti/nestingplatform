import { Component, OnInit } from '@angular/core';
import {pieces} from '../../services/pieces'

@Component({
  selector: 'lateral-bar',
  templateUrl: './lateral-bar.component.html',
  styleUrls: ['./lateral-bar.component.css']
})
export class LateralBarComponent implements OnInit {

  items:any[];

  constructor() {
    this.items = pieces;
  }

  ngOnInit() {
    
  }

  

}
