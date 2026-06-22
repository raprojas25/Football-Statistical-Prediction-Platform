import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS leagues (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        country VARCHAR(50),
        continent VARCHAR(50),
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE,
        logo_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS team_stats (
        id SERIAL PRIMARY KEY,
        team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        match_date TIMESTAMP NOT NULL,
        is_home BOOLEAN NOT NULL,
        goals_scored FLOAT,
        goals_conceded FLOAT,
        total_goals FLOAT,
        over_1_5 FLOAT,
        over_2_5 FLOAT,
        over_3_5 FLOAT,
        both_teams_scored FLOAT,
        win_rate FLOAT,
        draw_rate FLOAT,
        defeat_rate FLOAT,
        scored_first_rate FLOAT,
        conceded_first_rate FLOAT,
        corners_for_avg FLOAT,
        corners_against_avg FLOAT,
        total_corners_avg FLOAT,
        corners_over_2_5 FLOAT,
        corners_over_3_5 FLOAT,
        scoring_rate FLOAT,
        scoring_rate_1st_half FLOAT,
        scoring_rate_2nd_half FLOAT,
        conceding_rate FLOAT,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(team_id, match_date, is_home)
      );

      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        league_id INTEGER REFERENCES leagues(id) ON DELETE CASCADE,
        home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        match_date TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled',
        home_goals INTEGER,
        away_goals INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
        home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
        predicted_winner VARCHAR(10),
        predicted_goals_home FLOAT,
        predicted_goals_away FLOAT,
        over_1_5_probability FLOAT,
        over_2_5_probability FLOAT,
        over_3_5_probability FLOAT,
        btts_probability FLOAT,
        corners_over_9_5_probability FLOAT,
        total_corners_predicted FLOAT,
        confidence_level VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Tablas creadas exitosamente");
  } catch (error) {
    console.error("❌ Error migrando:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
