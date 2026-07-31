import { Component, viewChild } from '@angular/core';
import { NewSurvey } from '../new-survey/new-survey';
import { Question, Answer } from '../../models/survey.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-survey-detail',
  imports: [NewSurvey, RouterLink],
  templateUrl: './survey-detail.html',
  styleUrl: './survey-detail.scss',
})
export class SurveyDetail {
  newSurveyDialog = viewChild(NewSurvey);

  questions: Question[] = [
    {
      legend: '1. Which date would work best for you?',
      hint: 'More than one answers are possible.',
      allowMultiple: true,
      answers: [
        { label: 'A', text: '19.09.2025, Friday' },
        { label: 'B', text: '10.10.2025, Friday' },
        { label: 'C', text: '11.10.2025, Saturday' },
        { label: 'D', text: '31.10.2025, Friday' },
      ],
    },
    {
      legend: '2. Choose the activities you prefer',
      hint: 'More than one answers are possible.',
      allowMultiple: true,
      answers: [
        { label: 'A', text: 'Outdoor adventure like kayaking' },
        { label: 'B', text: 'Office Costume Party' },
        { label: 'C', text: 'Bowling, mini-golf, volleyball' },
        { label: 'D', text: 'Beach party, Music & cocktails' },
        { label: 'E', text: 'Escape room' },
      ],
    },
    {
      legend: "3. What's most important to you in a team event?",
      allowMultiple: false,
      answers: [
        { label: 'A', text: 'Team bonding' },
        { label: 'B', text: 'Food and drinks' },
        { label: 'C', text: 'Trying something new' },
        { label: 'D', text: 'Keeping it low-key and stress-free' },
      ],
    },
    {
      legend: '4. How long would you prefer the event to last?',
      allowMultiple: false,
      answers: [
        { label: 'A', text: 'Half a day' },
        { label: 'B', text: 'Full day' },
        { label: 'C', text: 'Evening only' },
      ],
    },
  ];

  openDialog() {
    this.newSurveyDialog()?.open();
  }

  toggleAnswer(question: Question, answer: Answer) {
    const wasSelected = !!answer.selected;

    if (!question.allowMultiple) {
      for (const a of question.answers) {
        a.selected = false;
      }
    }
    answer.selected = !wasSelected;
  }

  completeSurvey() {
    console.log(this.questions);
  }
}
