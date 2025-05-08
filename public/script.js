// Demo script
document.addEventListener('DOMContentLoaded', function() {
  const demoButton = document.getElementById('demo-button');
  const demoOutput = document.getElementById('demo-output');

  demoButton.addEventListener('click', function() {
    // This is just a mock representation of how the framework would be used
    const intent = {
      type: 'greeting',
      text: 'Hello, IntentSim Framework!'
    };

    // Mock processing function
    function processIntent(intent) {
      return `Processed intent of type: ${intent.type} with text: ${intent.text}`;
    }

    const result = processIntent(intent);
    demoOutput.textContent = result;
    demoOutput.style.display = 'block';
  });
});