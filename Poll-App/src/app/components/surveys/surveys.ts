import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Survey } from '../../models/survey.model';

const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

@Component({
  selector: 'app-surveys',
  imports: [RouterLink],
  templateUrl: './surveys.html',
  styleUrl: './surveys.scss',
})
export class Surveys {
  surveys: Survey[] = [
    {
      id: 1,
      category: 'Team activities',
      title: "Let's Plan the Next Team Event Together",
      endDate: daysFromNow(5),
    },
    {
      id: 2,
      category: 'Gaming',
      title: 'Gaming habits and favorite games!',
      endDate: daysFromNow(2),
    },
    {
      id: 3,
      category: 'Gaming',
      title: 'Gaming habits and favorite games!',
      endDate: daysFromNow(7),
    },
    {
      id: 4,
      category: 'Healthy Lifestyle',
      title: 'Healthier future: Fit & wellness survey!',
      endDate: daysFromNow(1),
    },
    {
      id: 5,
      category: 'Healthy Lifestyle',
      title: 'Healthier future: Fit & wellness survey!',
      endDate: daysFromNow(4),
    },
    {
      id: 6,
      category: 'Team activities',
      title: "Let's Plan the Next Team Event Together",
      endDate: daysFromNow(3),
    },
  ];

  get endingSurveys() {
    return [...this.surveys].sort((a, b) => a.endDate.getTime() - b.endDate.getTime()).slice(0, 3);
  }

  getDeadlineText(endDate: Date): string {
    const days = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days === 1 ? 'Ends in 1 Day' : `Ends in ${days} Days`;
  }
}
