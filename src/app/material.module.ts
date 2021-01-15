import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule
  ],
  exports : [
    MatButtonModule,
    MatExpansionModule
  ]
})
export class MaterialModule { }
