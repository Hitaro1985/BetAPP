import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BetPage } from './bet';

@NgModule({
  declarations: [
    BetPage,
  ],
  imports: [
    IonicPageModule.forChild(BetPage),
  ],
  exports: [
    BetPage
  ]
})
export class BetPageModule {}
