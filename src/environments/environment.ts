// src/environments/environment.ts  ← desarrollo
export const environment = {
  production: false,

  supabaseUrl:  'https://ujxjrcyefoegrdyrcazv.supabase.co',       // ej: https://xxxxx.supabase.co
  supabaseKey:  'sb_publishable_Y6Qt6WmYnp7fSS-WWfEMWA_fygqqBKS',  // el JWT largo de Project Settings → API

  // Solo se usa en la Edge Function (nunca acá en el frontend)
  // apiFootballKey: 'TU_API_FOOTBALL_KEY'

  tigre: {
    teamId:   452,   // ID de Tigre en API-Football
    leagueId: 128,    // Liga Profesional Argentina
    season:   2024
  }
};