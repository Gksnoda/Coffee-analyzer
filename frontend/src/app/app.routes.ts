import { Route } from '@angular/router';
import { NavComponent } from 'libs/master-page/nav/nav.component';
import { TestandoComponent } from './testando/testando.component';

export const appRoutes: Route[] = [
    {path: '', component: NavComponent},
    {path: 'teste', component: TestandoComponent}
];
