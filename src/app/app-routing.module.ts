import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { MenuComponent } from './components/compartido/menu/menu.component';

const routes: Routes = [
  { path: '', component: MenuComponent ,
  children : [
    {path: 'inicio', component: MapaComponent},
  ]},
  { path: 'registrarse', component: RegistrarseComponent },
  { path: 'login', component: IniciarSesionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
