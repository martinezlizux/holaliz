document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.before-after-slider .slider');
  if (!slider) return;

  const handle = slider.querySelector('.slider-handle');
  const beforeImage = slider.querySelector('.before');
  let isDragging = false;

  const setClip = (percent) => {
    handle.style.left = percent + '%';
    beforeImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  };

  const handleMove = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percent = (offsetX / rect.width) * 100;
    setClip(percent);
  };

  const startDrag = (clientX) => {
    isDragging = true;
    document.body.style.cursor = 'ew-resize';
    handleMove(clientX);
  };

  const stopDrag = () => {
    isDragging = false;
    document.body.style.cursor = '';
  };

  handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    startDrag(e.clientX);
  });

  document.addEventListener('mouseup', stopDrag);

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  handle.addEventListener('touchstart', function(e) {
    const touch = e.touches[0];
    startDrag(touch.clientX);
  }, { passive: true });

  document.addEventListener('touchend', stopDrag);

  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX);
  }, { passive: true });

  // ensure initial state is synced with CSS default
  setClip(50);
});
