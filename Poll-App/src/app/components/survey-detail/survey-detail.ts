import { Component, viewChild } from '@angular/core';
import { NewSurvey } from '../new-survey/new-survey';

@Component({
  selector: 'app-survey-detail',
  imports: [NewSurvey],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  newSurveyDialog = viewChild(NewSurvey);
  
  openDialog() {
    this.newSurveyDialog()?.open();
  }
}
