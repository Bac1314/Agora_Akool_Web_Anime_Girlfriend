/**
 * Device Manager
 * Handles audio and video device enumeration and switching
 */
class DeviceManager {
    constructor() {
        this.audioDevices = [];
        this.videoDevices = [];
        this.currentAudioDevice = null;
        this.currentVideoDevice = null;
        this.agoraClient = null;
        this.localAudioTrack = null;
        this.localVideoTrack = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Audio device elements
        this.audioDeviceBtn = document.getElementById('audioDeviceBtn');
        this.audioDeviceDropdown = document.getElementById('audioDeviceDropdown');
        this.audioDeviceList = document.getElementById('audioDeviceList');
        
        // Video device elements
        this.videoDeviceBtn = document.getElementById('videoDeviceBtn');
        this.videoDeviceDropdown = document.getElementById('videoDeviceDropdown');
        this.videoDeviceList = document.getElementById('videoDeviceList');
    }
    
    setupEventListeners() {
        // Store dropdown states
        this.audioDropdownOpen = false;
        this.videoDropdownOpen = false;
        
        // Audio device button - use mousedown to avoid conflicts
        if (this.audioDeviceBtn) {
            this.audioDeviceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.audioDeviceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Audio device button clicked');
                this.toggleDropdown('audio');
            });
        }
        
        // Video device button - use mousedown to avoid conflicts
        if (this.videoDeviceBtn) {
            this.videoDeviceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            this.videoDeviceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Video device button clicked');
                this.toggleDropdown('video');
            });
        }
        
        // Close dropdowns when clicking outside - use timeout to prevent immediate closing
        document.addEventListener('click', (e) => {
            setTimeout(() => {
                // Don't close if clicking on dropdown buttons or dropdowns themselves
                const clickedOnControl = e.target.closest('.control-dropdown-btn');
                const clickedOnDropdown = e.target.closest('.device-dropdown');
                
                if (!clickedOnControl && !clickedOnDropdown) {
                    console.log('Clicking outside, closing dropdowns');
                    this.closeAllDropdowns();
                }
            }, 10);
        });
        
        // Prevent dropdown clicks from propagating
        if (this.audioDeviceDropdown) {
            this.audioDeviceDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        if (this.videoDeviceDropdown) {
            this.videoDeviceDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    /**
     * Initialize device manager with Agora client and tracks
     */
    async initialize(agoraClient, localAudioTrack, localVideoTrack) {
        this.agoraClient = agoraClient;
        this.localAudioTrack = localAudioTrack;
        this.localVideoTrack = localVideoTrack;
        
        // Enable device buttons
        if (this.audioDeviceBtn) this.audioDeviceBtn.disabled = false;
        if (this.videoDeviceBtn) this.videoDeviceBtn.disabled = false;
        
        // Load initial devices
        await this.refreshDevices();
        
        // Listen for device changes
        navigator.mediaDevices.addEventListener('devicechange', () => {
            this.refreshDevices();
        });
    }
    
    /**
     * Refresh the list of available devices
     */
    async refreshDevices() {
        try {
            // Get all devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            // Filter audio input devices
            this.audioDevices = devices.filter(device => device.kind === 'audioinput');
            
            // Filter video input devices  
            this.videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            // Update UI
            this.updateAudioDeviceList();
            this.updateVideoDeviceList();
            
            // Set current devices if not set
            if (!this.currentAudioDevice && this.audioDevices.length > 0) {
                this.currentAudioDevice = this.audioDevices[0].deviceId;
            }
            
            if (!this.currentVideoDevice && this.videoDevices.length > 0) {
                this.currentVideoDevice = this.videoDevices[0].deviceId;
            }
        } catch (error) {
            console.error('Failed to enumerate devices:', error);
        }
    }
    
    /**
     * Update audio device list UI
     */
    updateAudioDeviceList() {
        if (!this.audioDeviceList) return;
        
        this.audioDeviceList.innerHTML = '';
        
        this.audioDevices.forEach((device, index) => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            if (device.deviceId === this.currentAudioDevice) {
                deviceItem.classList.add('active');
            }
            
            const deviceName = document.createElement('span');
            deviceName.className = 'device-name';
            deviceName.textContent = device.label || `Microphone ${index + 1}`;
            
            const deviceCheck = document.createElement('span');
            deviceCheck.className = 'device-check';
            deviceCheck.textContent = '✓';
            
            deviceItem.appendChild(deviceName);
            deviceItem.appendChild(deviceCheck);
            
            deviceItem.addEventListener('click', () => {
                this.switchAudioDevice(device.deviceId);
            });
            
            this.audioDeviceList.appendChild(deviceItem);
        });
        
        // Add "No microphone" option if no devices
        if (this.audioDevices.length === 0) {
            const noDevice = document.createElement('div');
            noDevice.className = 'device-item disabled';
            noDevice.textContent = 'No microphone detected';
            this.audioDeviceList.appendChild(noDevice);
        }
    }
    
    /**
     * Update video device list UI
     */
    updateVideoDeviceList() {
        if (!this.videoDeviceList) return;
        
        this.videoDeviceList.innerHTML = '';
        
        this.videoDevices.forEach((device, index) => {
            const deviceItem = document.createElement('div');
            deviceItem.className = 'device-item';
            if (device.deviceId === this.currentVideoDevice) {
                deviceItem.classList.add('active');
            }
            
            const deviceName = document.createElement('span');
            deviceName.className = 'device-name';
            deviceName.textContent = device.label || `Camera ${index + 1}`;
            
            const deviceCheck = document.createElement('span');
            deviceCheck.className = 'device-check';
            deviceCheck.textContent = '✓';
            
            deviceItem.appendChild(deviceName);
            deviceItem.appendChild(deviceCheck);
            
            deviceItem.addEventListener('click', () => {
                this.switchVideoDevice(device.deviceId);
            });
            
            this.videoDeviceList.appendChild(deviceItem);
        });
        
        // Add "No camera" option if no devices
        if (this.videoDevices.length === 0) {
            const noDevice = document.createElement('div');
            noDevice.className = 'device-item disabled';
            noDevice.textContent = 'No camera detected';
            this.videoDeviceList.appendChild(noDevice);
        }
    }
    
    /**
     * Switch to a different audio device
     */
    async switchAudioDevice(deviceId) {
        if (!this.localAudioTrack || deviceId === this.currentAudioDevice) return;
        
        try {
            // Switch the device
            await this.localAudioTrack.setDevice(deviceId);
            this.currentAudioDevice = deviceId;
            
            // Update UI
            this.updateAudioDeviceList();
            
            // Close dropdown
            this.closeDropdown('audio');
            
            console.log('Switched audio device to:', deviceId);
        } catch (error) {
            console.error('Failed to switch audio device:', error);
            alert('Failed to switch microphone. Please check your permissions.');
        }
    }
    
    /**
     * Switch to a different video device
     */
    async switchVideoDevice(deviceId) {
        if (!this.localVideoTrack || deviceId === this.currentVideoDevice) return;
        
        try {
            // Switch the device
            await this.localVideoTrack.setDevice(deviceId);
            this.currentVideoDevice = deviceId;
            
            // Update UI
            this.updateVideoDeviceList();
            
            // Close dropdown
            this.closeDropdown('video');
            
            console.log('Switched video device to:', deviceId);
        } catch (error) {
            console.error('Failed to switch video device:', error);
            alert('Failed to switch camera. Please check your permissions.');
        }
    }
    
    /**
     * Toggle dropdown visibility
     */
    toggleDropdown(type) {
        console.log(`Toggling ${type} dropdown`);
        
        if (type === 'audio') {
            // Close any other dropdowns first
            this.closeDropdown('video');
            
            // Toggle audio dropdown
            if (this.audioDropdownOpen) {
                console.log('Closing audio dropdown');
                this.closeDropdown('audio');
            } else {
                console.log('Opening audio dropdown');
                this.audioDropdownOpen = true;
                this.audioDeviceDropdown.style.display = 'block';
                this.audioDeviceBtn.classList.add('active');
                
                // Refresh devices before showing
                this.refreshDevices();
                
                // Add show class after a tiny delay for animation
                setTimeout(() => {
                    if (this.audioDropdownOpen) {
                        this.audioDeviceDropdown.classList.add('show');
                    }
                }, 50);
            }
        } else if (type === 'video') {
            // Close any other dropdowns first
            this.closeDropdown('audio');
            
            // Toggle video dropdown
            if (this.videoDropdownOpen) {
                console.log('Closing video dropdown');
                this.closeDropdown('video');
            } else {
                console.log('Opening video dropdown');
                this.videoDropdownOpen = true;
                this.videoDeviceDropdown.style.display = 'block';
                this.videoDeviceBtn.classList.add('active');
                
                // Refresh devices before showing
                this.refreshDevices();
                
                // Add show class after a tiny delay for animation
                setTimeout(() => {
                    if (this.videoDropdownOpen) {
                        this.videoDeviceDropdown.classList.add('show');
                    }
                }, 50);
            }
        }
    }
    
    /**
     * Close specific dropdown
     */
    closeDropdown(type) {
        if (type === 'audio' && this.audioDeviceDropdown) {
            console.log('Closing audio dropdown');
            this.audioDropdownOpen = false;
            this.audioDeviceDropdown.classList.remove('show');
            this.audioDeviceBtn.classList.remove('active');
            setTimeout(() => {
                if (!this.audioDropdownOpen && this.audioDeviceDropdown) {
                    this.audioDeviceDropdown.style.display = 'none';
                }
            }, 300);
        } else if (type === 'video' && this.videoDeviceDropdown) {
            console.log('Closing video dropdown');
            this.videoDropdownOpen = false;
            this.videoDeviceDropdown.classList.remove('show');
            this.videoDeviceBtn.classList.remove('active');
            setTimeout(() => {
                if (!this.videoDropdownOpen && this.videoDeviceDropdown) {
                    this.videoDeviceDropdown.style.display = 'none';
                }
            }, 300);
        }
    }
    
    /**
     * Close all dropdowns
     */
    closeAllDropdowns() {
        console.log('Closing all dropdowns');
        this.closeDropdown('audio');
        this.closeDropdown('video');
    }
    
    /**
     * Clean up
     */
    destroy() {
        this.closeAllDropdowns();
        this.audioDevices = [];
        this.videoDevices = [];
        this.currentAudioDevice = null;
        this.currentVideoDevice = null;
        this.audioDropdownOpen = false;
        this.videoDropdownOpen = false;
        
        // Disable device buttons
        if (this.audioDeviceBtn) this.audioDeviceBtn.disabled = true;
        if (this.videoDeviceBtn) this.videoDeviceBtn.disabled = true;
    }
}

// Create global instance
window.deviceManager = new DeviceManager();