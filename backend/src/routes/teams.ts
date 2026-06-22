import { Router } from "express";
import { db, schema } from "../db";
import { eq, or, desc, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const teams = await db
      .select()
      .from(schema.teams)
      .orderBy(asc(schema.teams.name));
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await db.query.teams.findFirst({
      where: eq(schema.teams.id, Number(req.params.id)),
      with: {
        stats: {
          orderBy: [desc(schema.teamStats.matchDate)],
          limit: 10,
        },
      },
    });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

router.get("/:id/stats", async (req, res) => {
  try {
    const stats = await db
      .select()
      .from(schema.teamStats)
      .where(eq(schema.teamStats.teamId, Number(req.params.id)))
      .orderBy(desc(schema.teamStats.matchDate))
      .limit(10);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching team stats:", error);
    res.status(500).json({ error: "Failed to fetch team stats" });
  }
});

router.get("/:id/history", async (req, res) => {
  try {
    const matches = await db
      .select()
      .from(schema.matches)
      .where(
        or(
          eq(schema.matches.homeTeamId, Number(req.params.id)),
          eq(schema.matches.awayTeamId, Number(req.params.id)),
        ),
      )
      .orderBy(desc(schema.matches.matchDate))
      .limit(20);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching team history:", error);
    res.status(500).json({ error: "Failed to fetch team history" });
  }
});

export default router;
