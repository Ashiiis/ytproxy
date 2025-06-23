import React, { useEffect, useRef, useState } from 'react';

const videoIds = [
  'JqfEG8xI_p0', // Replace with your actual video IDs
  
];

export default function YouTubeAutomationPlayer() {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      const randomId = getRandomVideoId();
      const newPlayer = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: randomId,
        events: {
          onReady: () => {
            newPlayer.playVideo();
            simulateViewingBehavior(newPlayer);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              const nextId = getRandomVideoId();
              newPlayer.loadVideoById(nextId);
              setTimeout(() => {
                newPlayer.playVideo(); // Auto start new video
              }, 2000);
            }
          }
        }
      });
      setPlayer(newPlayer);
    };

    // Fake cursor element
    const cursor = document.createElement('div');
    cursor.id = 'fakeCursor';
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.background = 'red';
    cursor.style.position = 'fixed';
    cursor.style.borderRadius = '50%';
    cursor.style.zIndex = '9999';
    document.body.appendChild(cursor);

    // Auto clear cache every 2 minutes
    const cacheInterval = setInterval(() => {
      clearCookiesAndStorage();
    }, 120000);

    return () => clearInterval(cacheInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => moveFakeCursor(), 2000);
    return () => clearInterval(interval);
  }, []);

  function getRandomVideoId() {
    return videoIds[Math.floor(Math.random() * videoIds.length)];
  }

  function simulateViewingBehavior(player) {
    function randomAction() {
      const actions = ['pause', 'play'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      if (action === 'pause') {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
    setInterval(randomAction, Math.random() * 15000 + 5000); // 5s - 20s
  }

  function moveFakeCursor() {
    const cursor = document.getElementById('fakeCursor');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }

  function clearCookiesAndStorage() {
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
    localStorage.clear();
    sessionStorage.clear();
    console.log('Cookies and storage cleared!');
  }

  function playClickAndScrollSounds() {
    const clickSound = new Audio('/click.mp3');
    const scrollSound = new Audio('/scroll.mp3');
    window.addEventListener('click', () => clickSound.play());
    window.addEventListener('scroll', () => scrollSound.play());
    clickSound.play(); // Auto-play sound once on start
  }

  useEffect(() => {
    playClickAndScrollSounds();
  }, []);

  return (
    <div className="p-4">
      <div id="player"></div>
      <button onClick={clearCookiesAndStorage} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Clear Cookies
      </button>
      <button onClick={playClickAndScrollSounds} className="ml-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Enable Sounds
      </button>
    </div>
  );
}
