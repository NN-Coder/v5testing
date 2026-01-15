lucide.createIcons();

const gameFrame = document.getElementById('gameFrame');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const shareBtn = document.getElementById('shareBtn');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameFrame.requestFullscreen().catch(err => {
            console.error(`Error: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

fullscreenBtn.addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: document.title,
                url: window.location.href,
            });
        } catch (err) { }
    } else {
        alert("Link: " + window.location.href);
    }
});