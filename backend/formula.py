"""
Formula orchestrator: fetches all NBA data once, runs each requirement
in sequence, and returns the full step-by-step prediction result.
Results are cached in memory for 1 hour.
"""
import time
from nba_api.stats.endpoints import (
    leaguestandings,
    leaguedashplayerstats,
    leaguedashteamstats,
    teamestimatedmetrics,
)
from reqs import req1_top_players, req2_mvp_candidates, req3_three_point, req4_defense, req5_fg_pct

_predict_cache: dict = {"data": None, "timestamp": 0.0}
_teams_cache: dict = {"data": None, "timestamp": 0.0}

PREDICT_TTL = 3600   # 1 hour
TEAMS_TTL = 86400    # 24 hours (standings are stable once playoffs start)

SEASON = "2025-26"

REQUIREMENTS = [
    (1, "Has a Top 10 PPG scorer or Top 10 RPG rebounder (among all playoff teams)", req1_top_players),
    (2, "Has a Top 10 MVP candidate",                                                req2_mvp_candidates),
    (3, "Top 10 in 3-Point % among remaining teams",                                req3_three_point),
    (4, "Top 5 in Defensive Rating among remaining teams",                          req4_defense),
    (5, "Best Field Goal % among remaining teams — Predicted Champion",             req5_fg_pct),
]


def _fetch_playoff_teams() -> list[dict]:
    df = leaguestandings.LeagueStandings(season=SEASON).get_data_frames()[0]
    west = df[df["Conference"] == "West"].sort_values("PlayoffRank").head(10)
    east = df[df["Conference"] == "East"].sort_values("PlayoffRank").head(10)
    teams = []
    for conf, rows in [("West", west), ("East", east)]:
        for _, row in rows.iterrows():
            teams.append({
                "team_id": int(row["TeamID"]),
                "team_name": row["TeamName"],
                "conference": conf,
                "rank": int(row["PlayoffRank"]),
            })
    return teams


def get_playoff_teams() -> list[dict]:
    """Returns the 20 playoff/play-in teams. Cached for 24 hours."""
    now = time.time()
    if _teams_cache["data"] and (now - _teams_cache["timestamp"]) < TEAMS_TTL:
        return _teams_cache["data"]
    teams = _fetch_playoff_teams()
    _teams_cache["data"] = teams
    _teams_cache["timestamp"] = now
    return teams


def run_formula() -> dict:
    """
    Runs all 5 requirements and returns the full prediction result.
    Cached for 1 hour after first call.
    """
    now = time.time()
    if _predict_cache["data"] and (now - _predict_cache["timestamp"]) < PREDICT_TTL:
        return _predict_cache["data"]

    # Fetch initial teams
    initial_teams = _fetch_playoff_teams()

    # Fetch all shared DataFrames once (avoids duplicate API calls across requirements)
    player_stats_df = leaguedashplayerstats.LeagueDashPlayerStats(season=SEASON).get_data_frames()[0]
    team_stats_df = leaguedashteamstats.LeagueDashTeamStats(season=SEASON).get_data_frames()[0]
    team_metrics_df = teamestimatedmetrics.TeamEstimatedMetrics(season=SEASON).get_data_frames()[0]

    # DataFrame lookup: each req gets the right DataFrame
    df_map = {
        1: player_stats_df,
        2: player_stats_df,
        3: team_stats_df,
        4: team_metrics_df,
        5: team_stats_df,
    }

    current_teams = initial_teams
    steps = []

    for req_num, label, req_module in REQUIREMENTS:
        remaining, eliminated, stats = req_module.run(current_teams, df_map[req_num])
        steps.append({
            "requirement": req_num,
            "label": label,
            "remaining": remaining,
            "eliminated": eliminated,
            "stats": stats,
        })
        current_teams = remaining
        if not current_teams:
            break

    result = {
        "initial_teams": initial_teams,
        "steps": steps,
        "champion": current_teams[0] if current_teams else None,
    }

    # Update both caches — teams are already known from initial fetch
    _teams_cache["data"] = initial_teams
    _teams_cache["timestamp"] = now
    _predict_cache["data"] = result
    _predict_cache["timestamp"] = now

    return result
