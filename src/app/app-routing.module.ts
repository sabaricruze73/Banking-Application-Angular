import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AddMoneyComponent } from './add-money/add-money.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { GamePageComponent } from './game-page/game-page.component';
import { SignupComponent } from './signup/signup.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-home',
    component: AdminHomeComponent,
    children: [
      { path: 'edit-details', component: EditDetailsComponent },
      { path: 'add-money', component: AddMoneyComponent },
    ],
  },
  { path: 'game-page', component: GamePageComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'user-home',
    component: UserHomeComponent,
    children: [{ path: 'add-money', component: AddMoneyComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
