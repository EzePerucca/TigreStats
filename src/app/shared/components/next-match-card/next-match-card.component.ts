import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../core/models/models';

@Component({
  selector: 'app-next-match-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-match-card.component.html',
  styleUrl: './next-match-card.component.scss'
})
export class NextMatchCardComponent {
  // input() es la forma moderna de @Input() en Angular 17+
  match = input.required<Match>();
}