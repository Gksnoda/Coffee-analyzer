import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { TestandoComponent } from './testando/testando.component';
import { NavComponent } from '../../libs/master-page/nav/nav.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent,
    RouterModule,
    TestandoComponent,
    NavComponent
    ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
