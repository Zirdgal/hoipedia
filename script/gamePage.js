document.addEventListener("DOMContentLoaded", function() {
    // Get the game file name from the URL
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const baseName = fileName.replace('.html', '');

    fetch(`../gameStats/${baseName}.json`)
    .then(res => res.json())
    .then(gameData => {
        document.getElementById('gameName').textContent = gameData.name;
        document.getElementById('gameDate').textContent = gameData.date;
        document.getElementById('winningTeam').textContent = gameData.winningTeam;
        document.getElementById('discord').href = gameData.server;

        // Find best player
        const bestPlayer = [...gameData.players]
            .sort((a, b) => {
                if (b.rating !== a.rating) return b.rating - a.rating;
                return b.divisions - a.divisions;
            })[0];

        document.getElementById('bestPlayer').textContent =
            `${bestPlayer.user} (${bestPlayer.country}) - Rating: ${bestPlayer.rating.toFixed(2)}`;

        const factions = ['Allies', 'Axis', 'Comintern', 'GEACPS', 'None'];
        const container = document.getElementById('tablesContainer');

        factions.forEach(faction => {
            const players = gameData.players.filter(p => p.faction === faction);
            if (players.length === 0) return;

            const factionHeader = document.createElement('h2');
            factionHeader.textContent = faction === 'None' ? 'No Faction' : faction;
            container.appendChild(factionHeader);

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                <tr>
                    <th>User</th>
                    <th>Country</th>
                    <th>Divisions</th>
                    <th>Casualties</th>
                    <th>Military Factories</th>
                    <th>Civilian Factories</th>
                    <th>Shipyards</th>
                    <th>Ships</th>
                    <th>States</th>
                    <th>Rating</th>
                </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');
            players.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.user}</td>
                    <td>${player.country}</td>
                    <td>${player.divisions}</td>
                    <td>${player.casualties}</td>
                    <td>${player.military_factories}</td>
                    <td>${player.civilian_factories}</td>
                    <td>${player.shipyards}</td>
                    <td>${player.ships}</td>
                    <td>${player.states}</td>
                    <td>${player.rating.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });

            container.appendChild(table);
        });
    })
    .catch(console.error);
});