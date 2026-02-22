import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-last-matches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './last-matches.component.html',
  styleUrl: './last-matches.component.scss'
})
export class LastMatchesComponent {
  @Input() matches: any[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() getResultLabel!: (result: string) => string;
  @Input() getResultClass!: (result: string) => string;

  trackById(index: number, match: any): number | string {
    return match?.id ?? index;
  }
}
