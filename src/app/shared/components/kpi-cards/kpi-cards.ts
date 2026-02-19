import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-cards',
  imports: [],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.scss',
})
export class KpiCards {
  @Input() stats: any;
}
