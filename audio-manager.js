class AudioManager {
    constructor() {
      this.context = null;
      this.sounds = {
        firework1: { url: 'sounds/firework1.mp3', buffer: null },
        firework2: { url: 'sounds/firework2.mp3', buffer: null },
        firework3: { url: 'sounds/firework3.mp3', buffer: null },
        background: { url: 'sounds/diwali-background.mp3', buffer: null }
      };
      this.backgroundMusic = null;
      this.volume = 1.0;
      this.enabled = true;
      this.initialized = false;
    }
  
    async init() {
      if (this.initialized) return;
      
      try {
        // Create audio context on user interaction
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume context (needed for Chrome's autoplay policy)
        if (this.context.state === 'suspended') {
          await this.context.resume();
        }
  
        console.log('Loading sounds...');
        await this.loadSounds();
        console.log('Sounds loaded successfully');
        
        this.initialized = true;
        this.startBackgroundMusic();
      } catch (error) {
        console.error('Audio initialization failed:', error);
        this.handleAudioError(error);
      }
    }
  
    async loadSounds() {
      const loadSound = async (url) => {
        try {
          console.log(`Loading sound: ${url}`);
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          return await this.context.decodeAudioData(arrayBuffer);
        } catch (error) {
          console.error(`Error loading sound ${url}:`, error);
          return null;
        }
      };
  
      const soundPromises = Object.entries(this.sounds).map(async ([key, sound]) => {
        sound.buffer = await loadSound(sound.url);
        return { key, success: !!sound.buffer };
      });
  
      const results = await Promise.all(soundPromises);
      const failedSounds = results.filter(r => !r.success).map(r => r.key);
      
      if (failedSounds.length > 0) {
        console.warn('Failed to load sounds:', failedSounds);
      }
    }
  
    handleAudioError(error) {
      if (error.name === 'NotAllowedError') {
        console.warn('Audio playback was not allowed. Please ensure user interaction has occurred.');
      } else if (error.name === 'NotSupportedError') {
        console.warn('Audio format is not supported by this browser.');
      }
    }
  
    playSound(buffer) {
      if (!this.enabled || !this.context || !buffer) return;
  
      try {
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        source.buffer = buffer;
        gainNode.gain.value = this.volume;
        
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  
    playRandomFireworkSound() {
      if (!this.enabled || !this.initialized) return;
      
      const availableSounds = [
        this.sounds.firework1.buffer,
        this.sounds.firework2.buffer,
        this.sounds.firework3.buffer
      ].filter(buffer => buffer !== null);
      
      if (availableSounds.length === 0) {
        console.warn('No firework sounds available');
        return;
      }
      
      const randomSound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
      this.playSound(randomSound);
    }
  
    startBackgroundMusic() {
      if (!this.enabled || !this.initialized || !this.sounds.background.buffer) {
        console.warn('Cannot start background music:', {
          enabled: this.enabled,
          initialized: this.initialized,
          hasBuffer: !!this.sounds.background.buffer
        });
        return;
      }
  
      try {
        if (this.backgroundMusic) {
          this.backgroundMusic.stop();
        }
  
        this.backgroundMusic = this.context.createBufferSource();
        const gainNode = this.context.createGain();
        
        this.backgroundMusic.buffer = this.sounds.background.buffer;
        this.backgroundMusic.loop = true;
        gainNode.gain.value = this.volume * 0.3;
        
        this.backgroundMusic.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        this.backgroundMusic.start(0);
      } catch (error) {
        console.error('Error starting background music:', error);
      }
    }
  
    toggleSound() {
      this.enabled = !this.enabled;
      
      if (this.enabled && this.context) {
        this.context.resume();
        if (!this.backgroundMusic && this.initialized) {
          this.startBackgroundMusic();
        }
      } else if (!this.enabled && this.context) {
        this.context.suspend();
      }
      
      return this.enabled;
    }
  
    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, value));
      console.log('Volume set to:', this.volume);
    }
  }