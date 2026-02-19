import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://your-supabase-url'; // Replace with your Supabase URL
const supabaseKey = 'your-supabase-key'; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

const API_FOOTBALL_URL = 'https://api-football.com'; // Replace with the correct API URL
const API_KEY = 'your-api-key'; // Replace with your API Key

const syncMatches = async () => {
  try {
    // Fetch matches data
    const response = await fetch(`${API_FOOTBALL_URL}/matches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const matches = await response.json();

    // Iterate through matches to sync data
    for (let match of matches) {
      const { id, lineup, events, player_stats, team_stats } = match;

      // Sync each match details
      await supabase
        .from('matches')
        .upsert({ id, lineup, events, player_stats, team_stats });
    }

    console.log('Matches synchronized successfully!');
  } catch (error) {
    console.error('Error synchronizing matches:', error);
  }
};

// Trigger syncMatches function
syncMatches();
