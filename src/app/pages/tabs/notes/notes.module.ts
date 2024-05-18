import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotesPage } from './notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    SharedModule
  ],
  declarations: [NotesPage]
})
export class NotesPageModule {}
