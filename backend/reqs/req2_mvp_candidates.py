"""
Requirement 2: Team must have at least one Top 10 MVP candidate.
Player IDs are the current top 10 players for the 2025-26 season.
"""
import pandas as pd

TOP_10_PLAYER_IDS = [
    1628983,  # Shai Gilgeous-Alexander
    1641705,  # Victor Wembanyama
    203999,   # Nikola Jokic
    1629029,  # Luka Doncic
    1627759,  # Jayson Tatum
    202695,   # Kawhi Leonard
    1630595,  # Cade Cunningham
    1630162,  # Evan Mobley
    1628378,  # Trae Young
    1628973,  # Jaren Jackson Jr.
]


def run(playoff_teams: list[dict], player_stats_df: pd.DataFrame) -> tuple:
    playoff_team_ids = [t["team_id"] for t in playoff_teams]

    df = player_stats_df[player_stats_df["PLAYER_ID"].isin(TOP_10_PLAYER_IDS)].copy()
    df["PPG"] = (df["PTS"] / df["GP"]).round(1)
    df["RPG"] = (df["REB"] / df["GP"]).round(1)
    df["APG"] = (df["AST"] / df["GP"]).round(1)

    order_map = {pid: i for i, pid in enumerate(TOP_10_PLAYER_IDS)}
    df["order"] = df["PLAYER_ID"].map(order_map)
    df = df.sort_values("order")

    qualifying_ids = set(df[df["TEAM_ID"].isin(playoff_team_ids)]["TEAM_ID"])

    remaining = [t for t in playoff_teams if t["team_id"] in qualifying_ids]
    eliminated = [t for t in playoff_teams if t["team_id"] not in qualifying_ids]

    stats = [
        {
            "player_name": r["PLAYER_NAME"],
            "team_id": int(r["TEAM_ID"]),
            "ppg": r["PPG"],
            "rpg": r["RPG"],
            "apg": r["APG"],
            "on_remaining_team": int(r["TEAM_ID"]) in playoff_team_ids,
        }
        for _, r in df.iterrows()
    ]

    return remaining, eliminated, stats
