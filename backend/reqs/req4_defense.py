"""
Requirement 4: Team must rank in the Top 5 in Defensive Rating among remaining teams.
Lower defensive rating is better (fewer points allowed per 100 possessions).
"""
import pandas as pd


def run(playoff_teams: list[dict], team_metrics_df: pd.DataFrame) -> tuple:
    # Bug fix: derive team_ids from playoff_teams param, not any outer scope variable
    playoff_team_ids = [t["team_id"] for t in playoff_teams]
    df = team_metrics_df[team_metrics_df["TEAM_ID"].isin(playoff_team_ids)].copy()
    df = df.sort_values("E_DEF_RATING", ascending=True).reset_index(drop=True)

    top_5 = df.head(5)
    qualifying_ids = set(top_5["TEAM_ID"])

    remaining = [t for t in playoff_teams if t["team_id"] in qualifying_ids]
    eliminated = [t for t in playoff_teams if t["team_id"] not in qualifying_ids]

    stats = [
        {
            "team_name": r["TEAM_NAME"],
            "team_id": int(r["TEAM_ID"]),
            "def_rating": round(float(r["E_DEF_RATING"]), 2),
            "rank": i + 1,
            "qualifies": i < 5,
        }
        for i, (_, r) in enumerate(df.iterrows())
    ]

    return remaining, eliminated, stats
