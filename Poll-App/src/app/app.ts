import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Surveys } from "./components/surveys/surveys";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, Surveys],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Poll-App');
}
