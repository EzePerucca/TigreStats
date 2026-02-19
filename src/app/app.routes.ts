import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Shell envuelve todas las páginas — sidebar se renderiza una sola vez
    loadComponent: () =>
      import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — TigreStats'
      },
      // {
      //   path: 'partidos',
      //   loadComponent: () =>
      //     import('./features/matches/matches.component').then(m => m.MatchesComponent),
      //   title: 'Partidos — TigreStats'
      // },
      // {
      //   path: 'plantel',
      //   loadComponent: () =>
      //     import('./features/players/players.component').then(m => m.PlayersComponent),
      //   title: 'Plantel — TigreStats'
      // },
      // {
      //   path: 'torneos',
      //   loadComponent: () =>
      //     import('./features/tournaments/tournaments.component').then(m => m.TournamentsComponent),
      //   title: 'Torneos — TigreStats'
      // },
      // {
      //   path: 'transferencias',
      //   loadComponent: () =>
      //     import('./features/transfers/transfers.component').then(m => m.TransfersComponent),
      //   title: 'Transferencias — TigreStats'
      // },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];