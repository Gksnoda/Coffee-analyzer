import { Component } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.css'],
  imports: [MatButtonModule, MatDividerModule, MatIconModule]
})

export class NavComponent{


}
