declare interface USBInTransferResult {
  data: DataView;
  status: 'ok' | 'stall' | 'babble';
}

declare interface Navigator {
  usb: {
    requestDevice(options: { filters: Array<{ vendorId: number; productId?: number }> }): Promise<USBDevice>;
    addEventListener(type: string, listener: (event: Event) => void): void;
    removeEventListener(type: string, listener: (event: Event) => void): void;
  };
}

interface HIDDevice {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName: string;
  manufacturerName: string;
  open(): Promise<void>;
  close(): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

interface HIDConnectionEvent extends Event {
  device: HIDDevice;
}

interface Navigator {
  hid: {
    requestDevice(options: { filters: Array<{ vendorId: number; productId?: number }> }): Promise<HIDDevice[]>;
    addEventListener(type: string, listener: (event: HIDConnectionEvent) => void): void;
    removeEventListener(type: string, listener: (event: HIDConnectionEvent) => void): void;
  };
}