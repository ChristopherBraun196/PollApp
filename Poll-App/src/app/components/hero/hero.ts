import { Component, output, viewChild } from '@angular/core';
import { NewSurvey } from '../new-survey/new-survey';

@Component({
  selector: 'app-hero',
  imports: [NewSurvey],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  newSurveyDialog = viewChild(NewSurvey);
  surveyCreated = output<void>();

  openDialog() {
    this.newSurveyDialog()?.open();
  }
}
