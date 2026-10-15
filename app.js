const video = document.querySelector('#traffic-video');
const modes = {
  annotated: {src: 'assets/annotated-web.mp4', name: 'output_single_line.mp4', label: 'PROCESSED FOOTAGE', poster: 'assets/poster.jpg'},
  original: {src: 'd.mp4', name: 'd.mp4', label: 'ORIGINAL FOOTAGE', poster: 'assets/original-poster.jpg'}
};
let pendingSeek = 0;
let resumePlayback = false;
document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    pendingSeek = video.currentTime || 0;
    resumePlayback = !video.paused;
    const mode = modes[button.dataset.mode];
    document.querySelectorAll('[data-mode]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#video-filename').textContent = mode.name;
    document.querySelector('#video-mode-label').textContent = mode.label;
    document.querySelector('#video-error').hidden = true;
    video.poster = mode.poster;
    video.src = mode.src;
    video.load();
  });
});
video.addEventListener('loadedmetadata', () => {
  document.querySelector('#video-resolution').textContent = `${video.videoWidth} × ${video.videoHeight}`;
  if (pendingSeek) video.currentTime = Math.min(pendingSeek, video.duration || pendingSeek);
  pendingSeek = 0;
  if (resumePlayback) video.play().catch(() => {});
  resumePlayback = false;
});
video.addEventListener('error', () => document.querySelector('#video-error').hidden = false);
video.querySelector('source').addEventListener('error', () => document.querySelector('#video-error').hidden = false);
