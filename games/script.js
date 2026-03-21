lucide.createIcons();

/**
 * Main function to load game data based on URL parameters
 * Example: game.html?id=bitlife
 */
async function loadGameData() {
    const displayTitle = document.getElementById('displayTitle');
    const gameFrame = document.getElementById('gameFrame');
    
    // 1. Extract the 'id' from the URL
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');

    if (!gameId) {
        displayTitle.innerText = "No Game Selected";
        return;
    }

    try {
        // 2. Fetch the central games.json from the root directory
        // Path is ../ because this script is inside the /games/ folder
        const response = await fetch('../games.json');
        const allGames = await response.json();

        // 3. Find the specific game data matching the ID
        const gameData = allGames.find(g => g.id === gameId);

        if (gameData) {
            // Update the Browser Tab Title and Header
            document.title = `${gameData.title} | EdCube`;
            displayTitle.innerText = gameData.title;
            
            // Update the Iframe Source to the game's index file
            gameFrame.src = `../game_sources/${gameData.id}/index.html`;
            
            // 4. Generate recommendations excluding the current game
            renderRecommendations(allGames, gameId);
        } else {
            displayTitle.innerText = "Game Not Found";
            document.title = "404 | EdCube";
        }

    } catch (error) {
        console.error("EdCube Engine Error:", error);
        displayTitle.innerText = "Error Loading Library";
    }
}

/**
 * Dynamically populates the recommended games grid
 * @param {Array} allGames - The full list of games from JSON
 * @param {string} currentId - The ID of the game currently being played
 */
function renderRecommendations(allGames, currentId) {
    const recGrid = document.getElementById('recommendedGrid');
    
    // Filter out the current game and take up to 3 others
    const filtered = allGames
        .filter(g => g.id !== currentId)
        .sort(() => 0.5 - Math.random()) // Randomize the suggestions
        .slice(0, 3);

    recGrid.innerHTML = filtered.map(game => `
        <a href="game.html?id=${game.id}" class="game-card">
            <div class="card-inner">
                <div class="card-thumb" style="background-image: url('../${game.image}');" loading="lazy"></div>
                <div class="card-overlay">
                    <span class="card-title">${game.title}</span>
                </div>
            </div>
        </a>
    `).join('');
}

/**
 * Fullscreen Toggle Logic
 */
const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameFrame.requestFullscreen().catch(err => {
            console.error(`Fullscreen Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

// Keyboard shortcut 'F' for fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

/**
 * Web Share API Logic
 */
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = window.location.href;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert("Link copied to clipboard!");
        }
    });
}

// Initialize loading when the DOM is ready
window.addEventListener('DOMContentLoaded', loadGameData);