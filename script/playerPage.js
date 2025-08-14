document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const baseName = fileName.replace('.html', '');

    fetch(`../../playerStats/${baseName}.json`)
    .then(res => res.json())
    .then(async playerData => {
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
                <td>${thisPlayer.faction}</td>
                <td>${thisPlayer.country}</td>
                <td>${thisPlayer ? thisPlayer.rating.toFixed(2) : "N/A"}</td>
                <td>${game.date}</td>
            `;
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                window.location.href = game.link3 || game.link2 || game.link;
            });

            tbody.appendChild(row);
        });
    })
    .catch(console.error);
});