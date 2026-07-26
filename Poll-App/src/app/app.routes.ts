import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { NewSurvey } from './components/new-survey/new-survey';
import { SurveyDetail } from './components/survey-detail/survey-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'new-survey', component: NewSurvey },
  { path: 'survey/:id', component: SurveyDetail },
];
