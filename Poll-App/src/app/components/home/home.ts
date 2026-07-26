import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Surveys } from '../surveys/surveys';

@Component({
  selector: 'app-home',
  imports: [Hero, Surveys],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
