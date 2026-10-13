// Show the surprise section. Triggered by the Unity game on victory (Phase 4).
function revealSurprise() {
  const surprise = document.getElementById('surprise');
  surprise.hidden = false;
  surprise.scrollIntoView({ behavior: 'smooth' });
}

// The Unity build will post {type: "victory"} from inside its iframe.
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data && event.data.type === 'victory') revealSurprise();
});

document.getElementById('fake-victory').addEventListener('click', revealSurprise);

// Dog Appreciation Corner: 10 photos (images/dog1.jpg ... dog10.jpg), shuffled with a slight random tilt.
(function buildDogGallery() {
  const gallery = document.getElementById('dog-gallery');
  const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  ids.forEach((n) => {
    const img = document.createElement('img');
    img.src = 'images/dog' + n + '.jpg';
    img.alt = 'Dog photo ' + n;
    img.loading = 'lazy';
    img.style.transform = 'rotate(' + (Math.random() * 8 - 4).toFixed(1) + 'deg)';
    gallery.appendChild(img);
  });
})();
