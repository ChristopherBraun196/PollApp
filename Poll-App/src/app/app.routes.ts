import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { SurveyDetail } from './components/survey-detail/survey-detail';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'survey/:id', component: SurveyDetail },
  { path: '**', component: NotFound },
];
