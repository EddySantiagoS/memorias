document.addEventListener("DOMContentLoaded", function () {
  const videosList = document.querySelector(".videos-list");
  const videos = document.querySelectorAll(".videos-list-item");

  let selectedIndex = -1; // Inicialmente no hay ningún video seleccionado
  let player;

  function updateVideosList() {
    videos.forEach((video, index) => {
      video.classList.toggle("selected", index === selectedIndex);
    });

    const selectedVideo = document.querySelector(".videos-list-item.selected");

    if (selectedVideo) {
      const selectedVideoRect = selectedVideo.getBoundingClientRect();
      const videosListRect = videosList.getBoundingClientRect();

      const offset = selectedVideoRect.left - videosListRect.left;
      const marginOffset = 15;

      // Calcula el nuevo margen izquierdo para desplazar la lista de videos
      const newMarginLeft = marginOffset - offset;

      // Aplica el nuevo margen izquierdo con una transición suave
      videosList.style.marginLeft = `${newMarginLeft}px`;
    }
  }

  function playVideo(index) {
    // Detener el video actual antes de cargar el nuevo video
    if (player) {
      player.stopVideo();
    }

    // Obtén el ID del video de YouTube
    const youtubeId = videos[index].dataset.youtubeId;

    // Inicializar el reproductor de YouTube si no está creado
    if (!player) {
      player = new YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: youtubeId,
        events: {
          onReady: function (event) {
            event.target.playVideo();
            selectedIndex = index; // Marcar como seleccionado el video que se está reproduciendo
            updateVideosList();
          },
          onStateChange: function (event) {
            if (event.data === YT.PlayerState.ENDED) {
              selectedIndex = -1; // Ningún video está reproduciéndose, eliminar la selección
              updateVideosList();
            }
          }
        }
      });
    } else {
      // Cargar y reproducir el nuevo video
      player.loadVideoById(youtubeId);
      player.playVideo();
      selectedIndex = index; // Marcar como seleccionado el video que se está reproduciendo
      updateVideosList();
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" && selectedIndex < videos.length - 1) {
      selectedIndex++;
    } else if (event.key === "ArrowLeft" && selectedIndex > 0) {
      selectedIndex--;
    }

    updateVideosList();
  });

  videos.forEach((video, index) => {
    video.addEventListener("mouseover", function () {
      selectedIndex = index;
      updateVideosList();
    });

    video.addEventListener("mouseout", function () {
      selectedIndex = -1; // No hay ningún video seleccionado
      updateVideosList();
    });

    video.addEventListener("click", function () {
      playVideo(index); // Reproducir el video cuando se hace clic en él
    });
  });
});
