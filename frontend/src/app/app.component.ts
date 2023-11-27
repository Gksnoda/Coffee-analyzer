import { HomeComponent } from './../../libs/Home/home/home.component';
import { DiasService } from './../../libs/master-page/Dias/dias.service';
import { DiasComponent } from './../../libs/master-page/Dias/dias.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NavComponent } from '../../libs/master-page/nav/nav.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';


@Component({
  standalone: true,
  imports: [NxWelcomeComponent,
    RouterModule,
    NavComponent,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    DiasComponent,
    HomeComponent,
    NgChartsModule
    ],
  providers: [DiasService,
    { provide: NgChartsConfiguration, useValue: { generateColors: false}}
    ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
}
