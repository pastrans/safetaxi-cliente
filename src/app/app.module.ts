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
@NgModule({
  declarations: [
    AppComponent,
    MapaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModule,
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
