# run with python3 updatePlayerGames.py

import json
import os

PLAYER_DIR = "../playerStats"
GAME_DIR = "../gameStats"

def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def main():
    # Collect all game data
    game_files = [f for f in os.listdir(GAME_DIR) if f.endswith(".json")]
    games = {}
    for game_file in game_files:
        game_path = os.path.join(GAME_DIR, game_file)
        game_data = load_json(game_path)
        if isinstance(game_data, dict) and "players" in game_data:
            games[game_file.replace(".json", "")] = game_data["players"]
        else:
            print(f"Skipped {game_file}: not a valid game object with 'players' key.")

    # Update each player file
    player_files = [f for f in os.listdir(PLAYER_DIR) if f.endswith(".json")]
    for player_file in player_files:
        player_path = os.path.join(PLAYER_DIR, player_file)
        player_data = load_json(player_path)
        user = player_data.get("user")
        games_played = []
        for game_name, players in games.items():
            for p in players:
                if p.get("user") == user:
                    games_played.append({game_name: str(p.get("rating"))})
        player_data["gamesPlayed"] = games_played
        save_json(player_path, player_data)
        print(f"Updated {player_file}")

if __name__ == "__main__":
    main()
