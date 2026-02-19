-- Migration for improving the database schema
CREATE TABLE clubs (
    club_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE match_lineups (
    lineup_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    position VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE match_events (
    event_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    event_type VARCHAR(100),
    player_id INT,
    event_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE player_match_stats (
    stat_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE TABLE match_team_stats (
    team_stat_id SERIAL PRIMARY KEY,
    match_id INT NOT NULL,
    team_id INT NOT NULL,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE player_absences (
    absence_id SERIAL PRIMARY KEY,
    player_id INT NOT NULL,
    match_id INT NOT NULL,
    absence_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (match_id) REFERENCES matches(match_id)
);

CREATE TABLE sync_logs (
    log_id SERIAL PRIMARY KEY,
    log_message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);