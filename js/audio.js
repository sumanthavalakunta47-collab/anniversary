/**
 * Romantic Ambient Audio Synthesizer & Soundscape Engine
 * Powered by Web Audio API for offline, smooth, cinematic romantic tones.
 */

class RomanticAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.intervalId = null;
    this.gainNode = null;
    
    // Romantic Pentatonic Chord Progression in D Major / F# Minor
    // (Frequencies in Hz: D4, F#4, A4, B4, C#5, E5, F#5, A5)
    this.notes = [
      293.66, // D4
      369.99, // F#4
      440.00, // A4
      493.88, // B4
      554.37, // C#5
      659.25, // E5
      739.99, // F#5
      880.00  // A5
    ];

    this.chords = [
      [293.66, 369.99, 440.00, 554.37], // Dmaj7
      [246.94, 369.99, 440.00, 554.37], // Bm9
      [220.00, 329.63, 440.00, 554.37], // Aadd9
      [369.99, 440.00, 554.37, 739.99]  // F#m7
    ];

    this.chordIndex = 0;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPianoNote(freq, time, duration = 2.4, velocity = 0.15) {
    if (!this.audioCtx || this.isMuted) return;

    // Harmonic synthesis: Fundamental + Soft Overtones with exponential decay
    const osc = this.audioCtx.createOscillator();
    const oscHarmonic = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, time);

    // Warm Low-pass Filter
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.exponentialRampToValueAtTime(velocity, time + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.gainNode);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  playChimeEffect() {
    this.initAudio();
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;
    const chimeFrequencies = [554.37, 659.25, 739.99, 880.00, 1108.73];
    chimeFrequencies.forEach((freq, idx) => {
      this.playPianoNote(freq, now + idx * 0.08, 1.8, 0.18);
    });
  }

  playSuccessCelebration() {
    this.initAudio();
    if (!this.audioCtx || this.isMuted) return;
    const now = this.audioCtx.currentTime;
    const fanfare = [440, 554.37, 659.25, 880];
    fanfare.forEach((f, i) => {
      this.playPianoNote(f, now + i * 0.12, 2.2, 0.22);
    });
  }

  toggleMusic() {
    this.initAudio();
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startMelodyLoop();
    } else {
      this.stopMelodyLoop();
    }

    return this.isPlaying;
  }

  startMelodyLoop() {
    if (this.intervalId) clearInterval(this.intervalId);

    const stepMelody = () => {
      if (!this.audioCtx || !this.isPlaying) return;
      const now = this.audioCtx.currentTime;
      const currentChord = this.chords[this.chordIndex % this.chords.length];

      // Arpeggiate chord
      currentChord.forEach((f, i) => {
        this.playPianoNote(f, now + i * 0.5, 3.5, 0.08);
      });

      // Add gentle high melodic sparkle
      const randomNote = this.notes[Math.floor(Math.random() * this.notes.length)];
      this.playPianoNote(randomNote, now + 1.2, 2.8, 0.1);

      this.chordIndex++;
    };

    stepMelody();
    this.intervalId = setInterval(stepMelody, 3200);
  }

  stopMelodyLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }
}

window.RomanticAudioEngine = RomanticAudioEngine;
