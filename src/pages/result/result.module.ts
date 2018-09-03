import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultPage } from './result';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ResultPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultPage),
  ],
  providers: [
    DatePipe
  ]
})
export class ResultPageModule {}
