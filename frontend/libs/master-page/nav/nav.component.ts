import { Component } from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.css'],
  imports: [MatToolbarModule]
})

export class NavComponent {}
