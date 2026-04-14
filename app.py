from nba_api.stats.endpoints import leaguestandings, leaguedashplayerstats, leaguedashteamstats, teamestimatedmetrics

# Play-In and Playoff Teams
standings = leaguestandings.LeagueStandings(season='2025-26')
df = standings.get_data_frames()[0]

top_west = df[df['Conference'] == 'West'].copy()
top_east = df[df['Conference'] == 'East'].copy()

top_10_west = top_west[["TeamID", "TeamName", "Conference", "PlayoffRank"]].head(10).copy()
top_10_east = top_east[["TeamID", "TeamName", "Conference", "PlayoffRank"]].head(10).copy()

top_west = list(zip(top_10_west["TeamID"], top_10_west["TeamName"]))
top_east = list(zip(top_10_east["TeamID"], top_10_east["TeamName"]))

playoff_teams = top_west + top_east
print(f"Starting teams ({len(playoff_teams)}): {[t[1] for t in playoff_teams]}")



# Requirement 1: Top Players (PPG and RPG)
players = leaguedashplayerstats.LeagueDashPlayerStats(season='2025-26')
df = players.get_data_frames()[0]

playoff_team_ids = [team[0] for team in playoff_teams]
df_playoff_teams = df[df["TEAM_ID"].isin(playoff_team_ids)].copy()

df_playoff_teams["PPG"] = df_playoff_teams["PTS"] / df_playoff_teams["GP"]
df_playoff_teams["RPG"] = df_playoff_teams["REB"] / df_playoff_teams["GP"]

df_ppg_sorted = df_playoff_teams.sort_values("PPG", ascending=False)
df_rpg_sorted = df_playoff_teams.sort_values("RPG", ascending=False)

top_10_ppg = df_ppg_sorted.head(10)
top_10_rpg = df_rpg_sorted.head(10)

teams_with_top_ppg = set(top_10_ppg["TEAM_ID"].tolist())
teams_with_top_rpg = set(top_10_rpg["TEAM_ID"].tolist())
req1_qualifying_team_ids = teams_with_top_ppg | teams_with_top_rpg

# Eliminate teams that don't qualify
playoff_teams = [(tid, tname) for tid, tname in playoff_teams if tid in req1_qualifying_team_ids]
print(f"\nAfter Req 1 - Top PPG/RPG player ({len(playoff_teams)} remain): {[t[1] for t in playoff_teams]}")

top_ppg = list(zip(top_10_ppg["PLAYER_NAME"], top_10_ppg["PPG"].round(1)))
top_rpg = list(zip(top_10_rpg["PLAYER_NAME"], top_10_rpg["RPG"].round(1)))
top_ppg_rpg = top_ppg + top_rpg



# Requirement 2: Top 10 Current Players
players = leaguedashplayerstats.LeagueDashPlayerStats(season='2025-26')
df = players.get_data_frames()[0]

top_10_player_ids = [1628983, 1641705, 203999, 1629029, 1627759, 202695, 1630595, 1630162, 1628378, 1628973]
df_top_10_players = df[df["PLAYER_ID"].isin(top_10_player_ids)].copy()

df_top_10_players["PPG"] = df_top_10_players["PTS"] / df_top_10_players["GP"]
df_top_10_players["RPG"] = df_top_10_players["REB"] / df_top_10_players["GP"]
df_top_10_players["APG"] = df_top_10_players["AST"] / df_top_10_players["GP"]

order_map = {player_id: i for i, player_id in enumerate(top_10_player_ids)}
df_top_10_players["order"] = df_top_10_players["PLAYER_ID"].map(order_map)
df_top_10_players = df_top_10_players.sort_values("order")

top_10_players = list(zip(
    df_top_10_players["PLAYER_NAME"],
    df_top_10_players["PPG"].round(1),
    df_top_10_players["RPG"].round(1),
    df_top_10_players["APG"].round(1)
))

playoff_team_ids = [team[0] for team in playoff_teams]
teams_with_top_player = set(
    df_top_10_players[df_top_10_players["TEAM_ID"].isin(playoff_team_ids)]["TEAM_ID"].tolist()
)

# Eliminate teams that don't qualify
playoff_teams = [(tid, tname) for tid, tname in playoff_teams if tid in teams_with_top_player]
print(f"\nAfter Req 2 - Has top 10 current player ({len(playoff_teams)} remain): {[t[1] for t in playoff_teams]}")



# Requirement 3: Top 10 in 3-Point % (Remaining Teams)
teams = leaguedashteamstats.LeagueDashTeamStats(season='2025-26')
df = teams.get_data_frames()[0]

team_ids = [team[0] for team in playoff_teams]
df_teams = df[df["TEAM_ID"].isin(team_ids)].copy()

df_3pt_team_rank = df_teams.sort_values("FG3_PCT", ascending=False)
top_10_3pt_teams = df_3pt_team_rank.head(10)
top_10_3pt_pct = list(zip(top_10_3pt_teams["TEAM_NAME"], top_10_3pt_teams["FG3_PCT"].round(2)))

# Eliminate teams that don't qualify
qualifying_3pt_team_ids = set(top_10_3pt_teams["TEAM_ID"].tolist())
playoff_teams = [(tid, tname) for tid, tname in playoff_teams if tid in qualifying_3pt_team_ids]
print(f"\nAfter Req 3 - Top 10 3PT% ({len(playoff_teams)} remain): {[t[1] for t in playoff_teams]}")



# Requirement 4: Top 5 in Defensive Rating (Remaining Teams)
teams_d = teamestimatedmetrics.TeamEstimatedMetrics(season='2025-26')
df = teams_d.get_data_frames()[0]

teams_defense = [team[0] for team in playoff_teams]
df_teams_defense = df[df["TEAM_ID"].isin(team_ids)].copy()

df_defense_rating_rank = df_teams_defense.sort_values("E_DEF_RATING", ascending=True)
top_10_defense_rating_teams = df_defense_rating_rank.head(5)
top_10_defense_rating = list(zip(top_10_defense_rating_teams["TEAM_NAME"], top_10_defense_rating_teams["E_DEF_RATING"].round(2)))

# Eliminate teams that don't qualify
qualifying_defense_rating_team_ids = set(top_10_defense_rating_teams["TEAM_ID"].tolist())
playoff_teams = [(tid, tname) for tid, tname in playoff_teams if tid in qualifying_defense_rating_team_ids]
print(f"\nAfter Req 4 - Top 5 Defensive Rating ({len(playoff_teams)} remain): {[t[1] for t in playoff_teams]}")



# Requirement 5: Top FG%
teams_fg = leaguedashteamstats.LeagueDashTeamStats(season='2025-26')
df = teams.get_data_frames()[0]

teams_fgpct = [team[0] for team in playoff_teams]
df_teams_fgpct = df[df["TEAM_ID"].isin(teams_fgpct)].copy()

df_fgpct_rank = df_teams_fgpct.sort_values("FG_PCT", ascending=False)
top_fgpct_team = df_fgpct_rank.head(1)
top_fgpct = list(zip(top_fgpct_team["TEAM_NAME"], top_fgpct_team["FG_PCT"].round(2)))

# Eliminate teams that don't qualify
qualifying_fgpct_team_ids = set(top_fgpct_team["TEAM_ID"].tolist())
playoff_teams = [(tid, tname) for tid, tname in playoff_teams if tid in qualifying_fgpct_team_ids]
print(f"\nAfter Req 5 - Top FG% ({len(playoff_teams)} remain): {[t[1] for t in playoff_teams]}")



# Final Result
print(f"\n{'='*50}")
if playoff_teams:
    print(f"Predicted Champion(s): {[t[1] for t in playoff_teams]}")
else:
    print("No teams survived all requirements — loosen a criterion.")
