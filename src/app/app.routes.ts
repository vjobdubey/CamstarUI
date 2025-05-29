import { Routes } from '@angular/router';
import { AgTableComponent } from './pages/ag-table/ag-table.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { EventsComponent } from './pages/events/events.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {path:'reports',component:AgTableComponent},
    {path:'calendar',component:CalendarComponent},
     { path: 'events', component: EventsComponent },
  { path: 'profile', component: ProfileComponent },
    { path: '', redirectTo: '/reports', pathMatch: 'full' }
];
