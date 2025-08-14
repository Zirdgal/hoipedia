document.addEventListener("DOMContentLoaded", async function() {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const baseName = fileName.replace('.html', '');

    // Get all player JSON files
    let playerFiles = [];
    try {
        // List of player files must be known or generated; here we hardcode or fetch from an index if you have one
        // Example: fetch a player index JSON file
        // const indexRes = await fetch('../../playerStats/index.json');
        // playerFiles = await indexRes.json();
        // For now, fallback to just trying the baseName
        playerFiles = [`${baseName}.json`];
    } catch (e) {
        playerFiles = [`${baseName}.json`];
    }

    let playerData = null;
    for (const file of playerFiles) {
        try {
            const data = await fetch(`../../playerStats/${file}`).then(r => r.json());
            if (data.id === baseName) {
                playerData = data;
                break;
            }
        } catch (e) {}
    }

    if (!playerData) {
        document.getElementById("name").textContent = "Player not found";
        return;
    }

    document.getElementById("name").textContent = `${playerData.user}`;
    document.getElementById("country").textContent = `Country: ${playerData.country}`;
    document.getElementById("discord").textContent = `Discord: ${playerData.discord}`;

    let gamesPlayedArray = playerData.gamesPlayed;
    if (!gamesPlayedArray || gamesPlayedArray.length === 0) {
        document.getElementById("recentGames").textContent = "Recent games played: None";
        return;
    }

    // Fetch all game data for games played
    const gameNames = gamesPlayedArray.map(obj => Object.keys(obj)[0]);
    const gameDataArr = await Promise.all(
        gameNames.map(gameName =>
            fetch(`../../gameStats/${gameName}.json`).then(r => r.json()).catch(() => null)
        )
    );

    // Prepare table body
    const tbody = document.querySelector('#gamesTable tbody');
    tbody.innerHTML = ""; // Clear previous

    gameDataArr.forEach((game, idx) => {
        if (!game) return; // skip if fetch failed

        // Find this player's rating for this game
        const thisPlayer = game.players.find(p => p.user === playerData.user);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.name}</td>
            <td>${thisPlayer ? thisPlayer.faction : ""}</td>
            <td>${thisPlayer ? thisPlayer.country : ""}</td>
            <td>${thisPlayer ? thisPlayer.rating.toFixed(2) : "N/A"}</td>
            <td>${game.date}</td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            window.location.href = game.link3 || game.link2 || game.link;
        });

        tbody.appendChild(row);
    });
});