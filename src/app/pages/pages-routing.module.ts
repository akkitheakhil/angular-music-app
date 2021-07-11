import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '', component: PagesComponent, children: [
      { path: 'welcome', loadChildren: () => import('./components/welcome/welcome.module').then(m => m.WelcomeModule) },
      { path: 'player', loadChildren: () => import('./components/player/player.module').then(m => m.PlayerModule) },
      { path: '**', redirectTo: 'welcome' }
    ],
  },
  {
    path: '**', redirectTo: 'welcome'
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
