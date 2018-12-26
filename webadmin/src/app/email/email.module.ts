import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard.component';
import { EmailComponent  } from './email.component';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';




const routes: Routes = [
    { path: 'email', component:EmailComponent ,canActivate : [AuthGuard]},
];
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    EditorModule
    
    ],
  declarations: [
    EmailComponent
  ],
  bootstrap: [EmailComponent]
})
export class EmailModule { }
