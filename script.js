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
