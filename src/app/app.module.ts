import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapaComponent } from './components/mapa/mapa.component';
import { MatSliderModule } from '@angular/material/slider';
import { AgmCoreModule } from '@agm/core';            // @agm/core
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { MaterialModule } from './material.module';
import { RegistrarseComponent } from './components/registrarse/registrarse.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/compartido/menu/menu.component';
@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    RegistrarseComponent,
    IniciarSesionComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8drXGd-uq-LK538tdRymcCHbYjojfylw',
      libraries: ["places", "geometry"]
    }),
    AgmDirectionModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
