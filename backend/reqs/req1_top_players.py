"""
Requirement 1: Team must have a player in the Top 10 PPG or Top 10 RPG
among all playoff/play-in teams.
"""
import pandas as pd


def run(playoff_teams: list[dict], player_stats_df: pd.DataFrame) -> tuple:
    playoff_team_ids = [t["team_id"] for t in playoff_teams]
    df = player_stats_df[player_stats_df["TEAM_ID"].isin(playoff_team_ids)].copy()

    df["PPG"] = (df["PTS"] / df["GP"]).round(1)
    df["RPG"] = (df["REB"] / df["GP"]).round(1)

    top_10_ppg = df.sort_values("PPG", ascending=False).head(10)
    top_10_rpg = df.sort_values("RPG", ascending=False).head(10)

    qualifying_ids = set(top_10_ppg["TEAM_ID"]) | set(top_10_rpg["TEAM_ID"])

    remaining = [t for t in playoff_teams if t["team_id"] in qualifying_ids]
    eliminated = [t for t in playoff_teams if t["team_id"] not in qualifying_ids]

    stats = (
        [{"player_name": r["PLAYER_NAME"], "team_id": int(r["TEAM_ID"]), "ppg": r["PPG"], "type": "PPG"}
         for _, r in top_10_ppg.iterrows()]
        + [{"player_name": r["PLAYER_NAME"], "team_id": int(r["TEAM_ID"]), "rpg": r["RPG"], "type": "RPG"}
           for _, r in top_10_rpg.iterrows()]
    )

    return remaining, eliminated, stats
