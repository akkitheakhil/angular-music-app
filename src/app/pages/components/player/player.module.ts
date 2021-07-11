import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import { LibraryComponent } from './components/library/library.component';
import { WaveLoaderComponent } from './components/wave-loader/wave-loader.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlayerComponent,
    LibraryComponent,
    WaveLoaderComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PlayerModule { }
