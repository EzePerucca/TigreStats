import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  isCollapsed = signal(false);

  toggle(): void {
    this.isCollapsed.update(v => !v);
  }

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',      route: '/dashboard',      icon: 'grid'     },
    { label: 'Historial Partidos',       route: '/matches',        icon: 'calendar' },
    { label: 'Plantel',        route: '/plantel',        icon: 'users'    },
    { label: 'Torneos',        route: '/torneos',        icon: 'trophy'   },
    { label: 'Transferencias', route: '/transferencias', icon: 'swap'     },
  ];
}
