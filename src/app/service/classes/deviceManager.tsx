class DeviceManager {
  private isSmallDeviceChecked: boolean = false;
  private isSmallDeviceCheck: boolean = false;

  isSmallDevice() {
    if (this.isSmallDeviceChecked) return this.isSmallDeviceCheck;
    this.isSmallDeviceChecked = true;
    this.isSmallDeviceCheck = window.innerWidth <= 768;
    return this.isSmallDeviceCheck;
  }
}

export const deviceManager = new DeviceManager();