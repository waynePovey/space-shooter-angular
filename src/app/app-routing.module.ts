import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@components/home/home.component';
import { RoutePath } from '@common/routes';
import { SolarSystemComponent } from '@scenes/solar-system/solar-system.component';


const routes: Routes = [
  { path: RoutePath.HOME, component: HomeComponent },
  { path: RoutePath.SOLAR_SYSTEM, component: SolarSystemComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
