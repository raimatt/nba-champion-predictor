"""
Requirement 5: The team with the best Field Goal % among remaining teams wins.
This is the final requirement — one team is left as the predicted champion.
"""
import pandas as pd


def run(playoff_teams: list[dict], team_stats_df: pd.DataFrame) -> tuple:
    # Bug fix: filter using the pre-fetched team_stats_df passed in,
    # not any stale reference from outer scope (original bug in app.py line 122).
    playoff_team_ids = [t["team_id"] for t in playoff_teams]
    df = team_stats_df[team_stats_df["TEAM_ID"].isin(playoff_team_ids)].copy()
    df = df.sort_values("FG_PCT", ascending=False).reset_index(drop=True)

    top_1 = df.head(1)
    qualifying_ids = set(top_1["TEAM_ID"])

    remaining = [t for t in playoff_teams if t["team_id"] in qualifying_ids]
    eliminated = [t for t in playoff_teams if t["team_id"] not in qualifying_ids]

    stats = [
        {
            "team_name": r["TEAM_NAME"],
            "team_id": int(r["TEAM_ID"]),
            "fg_pct": round(float(r["FG_PCT"]), 3),
            "rank": i + 1,
            "qualifies": i == 0,
        }
        for i, (_, r) in enumerate(df.iterrows())
    ]

    return remaining, eliminated, stats
