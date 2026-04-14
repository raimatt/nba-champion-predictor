"""
Requirement 3: Team must rank in the Top 10 in 3-Point % among remaining teams.
"""
import pandas as pd

TOP_N = 10


def run(playoff_teams: list[dict], team_stats_df: pd.DataFrame) -> tuple:
    playoff_team_ids = [t["team_id"] for t in playoff_teams]
    df = team_stats_df[team_stats_df["TEAM_ID"].isin(playoff_team_ids)].copy()
    df = df.sort_values("FG3_PCT", ascending=False).reset_index(drop=True)

    top_n = df.head(TOP_N)
    qualifying_ids = set(top_n["TEAM_ID"])

    remaining = [t for t in playoff_teams if t["team_id"] in qualifying_ids]
    eliminated = [t for t in playoff_teams if t["team_id"] not in qualifying_ids]

    stats = [
        {
            "team_name": r["TEAM_NAME"],
            "team_id": int(r["TEAM_ID"]),
            "fg3_pct": round(float(r["FG3_PCT"]), 3),
            "rank": i + 1,
            "qualifies": i < TOP_N,
        }
        for i, (_, r) in enumerate(df.iterrows())
    ]

    return remaining, eliminated, stats
