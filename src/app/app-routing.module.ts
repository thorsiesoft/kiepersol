import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'order', component: OrderComponent },
  { path: 'inventory', component: InventoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
