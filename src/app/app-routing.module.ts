import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Public and Shared Components
import { MainPageComponent } from './views/Pages/main-page/main-page.component';



const routes: Routes = [
  // Public routes
  { path: 'main', component: MainPageComponent, title: 'Main page' },
  { path: 'talent-page', loadChildren: () => import('./views/Pages/talent-page/talent-pages.module').then((m) => m.TalentPageModule ), title: 'Talent Page' },
  { path: '**', redirectTo: 'talent-page' }, // Fallback rou

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
