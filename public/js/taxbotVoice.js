// TaxBot Voice Search for tax-related questions
// Uses Web Speech API and fetches from internet if needed

function startTaxBotVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Voice recognition not supported in this browser.');
    return;
  }
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = function() {
    document.getElementById('taxbot-voice-status').textContent = 'Listening for your tax question...';
  };
  recognition.onend = function() {
    document.getElementById('taxbot-voice-status').textContent = '';
  };
  recognition.onerror = function(e) {
    document.getElementById('taxbot-voice-status').textContent = 'Error: ' + e.error;
  };
  recognition.onresult = async function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('taxbot-voice-status').textContent = `Searching: ${transcript}`;
    // Try to answer using TaxBot first
    if (window.askQuestion) {
      window.askQuestion(transcript);
    } else {
      // Fallback: search internet (simple Google search)
      window.open('https://www.google.com/search?q=' + encodeURIComponent(transcript + ' tax India'), '_blank');
    }
  };
  recognition.start();
}

window.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('taxbot-voice-btn');
  if (btn) {
    btn.addEventListener('click', startTaxBotVoice);
    btn.title = 'Try asking:\n"What is Section 80C?"\n"How to claim HRA?"\n"ITR due date?"\n"Track my refund"\n"What is PAN?"\n"Advance tax rules?"';
  }
});
