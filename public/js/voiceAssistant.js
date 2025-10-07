// Simple AI Voice Assistant for navigation
// Uses Web Speech API for voice recognition and command matching

const commands = {
  dashboard: '/dashboard',
  'file taxes': '/filing/start',
  logout: '/auth/logout',
  settings: '/settings',
  'tax calendar': '/features/calendar',
  'refund history': '/features/refund-history',
  'document vault': '/features/documents',
  'tax bot': '/taxbot',
  'support': '/features/support',
  'privacy policy': '/features/privacy',
  'security': '/features/security',
  'tax calculator': '/features/calculator',
};

function findClosestCommand(spoken) {
  const spokenLower = spoken.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  Object.keys(commands).forEach(cmd => {
    let score = 0;
    if (spokenLower === cmd) score = 100;
    else if (cmd.includes(spokenLower) || spokenLower.includes(cmd)) score = 80;
    else {
      // Simple similarity: count matching words
      const spokenWords = spokenLower.split(' ');
      const cmdWords = cmd.split(' ');
      score = spokenWords.filter(w => cmdWords.includes(w)).length * 20;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cmd;
    }
  });
  return bestScore > 0 ? bestMatch : null;
}

function startVoiceAssistant() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice recognition not supported in this browser.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    document.getElementById('voice-assistant-status').textContent = 'Listening...';
  };
  recognition.onend = function() {
    document.getElementById('voice-assistant-status').textContent = '';
  };
  recognition.onerror = function(e) {
    document.getElementById('voice-assistant-status').textContent = 'Error: ' + e.error;
  };
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    let match = findClosestCommand(transcript);
    if (match) {
      document.getElementById('voice-assistant-status').textContent = `Navigating to: ${match}`;
      setTimeout(() => {
        window.location.href = commands[match];
      }, 1200);
    } else {
      document.getElementById('voice-assistant-status').textContent = `Command not found. Try again.`;
    }
  };
  recognition.start();
}

window.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('voice-assistant-btn');
  if (btn) {
    btn.addEventListener('click', startVoiceAssistant);
  }
});
