import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { Not404Component } from './pages/not404/not404.component';
import { ForgotComponent } from './login/forgot/forgot.component';
import { RandomComponent } from './login/forgot/random/random.component';
import { NewUserComponent } from './login/new-user/new-user.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'my-account', component: ProfileComponent },
    {
        path: 'pages',
        component: LayoutComponent,
        loadChildren: () => import('./pages/pages.routes').then(x => x.pagesRoutes)
    },
    {
        //KeyCloak
        path: 'new-user',
        component: NewUserComponent
    },
    {
        path: 'forgot',
        component: ForgotComponent,
        children: [ { path: ':random', component: RandomComponent } ]
    },
    { path: '**', component: Not404Component }
];
