import { DiasComponent } from 'libs/master-page/Dias/dias.component';
import { FooterComponent } from './../../master-page/footer/footer.component';
import { NavComponent } from './../../master-page/nav/nav.component';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavComponent, FooterComponent, DiasComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let x = 0;
  }

}
