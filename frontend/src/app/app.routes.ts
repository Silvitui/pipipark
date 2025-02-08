
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MapaComponent } from './components/mapa/mapa.component';

export const routes: Routes = [
{ path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: "map",component: MapaComponent},
  { path: '**', redirectTo: 'welcome' } 
];


