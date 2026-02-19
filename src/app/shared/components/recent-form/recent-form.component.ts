import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-form',
  standalone: true,
  templateUrl: './recent-form.component.html',
  styleUrls: ['./recent-form.component.scss'],
})
export class RecentFormComponent {
  @Input() recentForm: string[] = [];
  @Input() getResultLabel!: (result: string) => string;
  @Input() getResultClass!: (result: string) => string;
}
