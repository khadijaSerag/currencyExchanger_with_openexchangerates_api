import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ConverterComponent } from './converter/converter.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: '', component: ConverterComponent, pathMatch: 'full' },
  { path: 'home', component: ConverterComponent },
  {
    path: 'details',
    component: DetailsComponent,
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
