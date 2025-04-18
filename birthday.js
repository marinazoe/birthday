async function initMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  //Browser nach Erlaubnis des Mikros erlauben, wenn ja dann Strom von Mikro
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();  //Zugriff auf AudioKontext
      const source = audioContext.createMediaStreamSource(stream); //Stream in Audioquelle verwandeln, um ihn analysieren zu können
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;  //Analyser zerlegt Signal in Frequenzbereiche

      const dataArray = new Uint8Array(analyser.frequencyBinCount); //Array mit Werten 0-255 - jede Zahl für Laustärke im Frequenzbereich
      source.connect(analyser); // Mikrofon-Audio-Stream in Analyser weiterleiten

      function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        if (volume > 65) { // Schwellwert zum "Pusten"
          document.getElementById('flame').style.opacity = 0;
          document.getElementById('message').style.display = 'block';

          confetti({
            particleCount: 100,
            spread: 70,
            origin: {y:0.6}
          });
        } else {
          requestAnimationFrame(checkVolume);
        }
      }

      checkVolume();
    } catch (err) {
      alert("Mikrofonzugriff fehlgeschlagen: " + err);
    }
  }

  initMic();