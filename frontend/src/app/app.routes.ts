import { HomeComponent } from './../../libs/Home/home/home.component';
import { DiasComponent } from './../../libs/master-page/Dias/dias.component';
import { Route } from '@angular/router';
import { NavComponent } from 'libs/master-page/nav/nav.component';
import { TestandoComponent } from './testando/testando.component';

export const appRoutes: Route[] = [
    {path: '', component: HomeComponent},
    {path: 'dias', component: DiasComponent}
];
