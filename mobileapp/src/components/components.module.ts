import {NgModule} from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { BellComponent } from './bell/bell';


@NgModule({
	declarations: [BellComponent],
	imports: [
    IonicModule,
    ],
	exports: [BellComponent], 
	entryComponents: [BellComponent]

})

export class ComponentsModule {}
