/**
 * Notification Service
 * Handles notification logic, formatting, and integration with backend
 */

import { NotificationType } from '../contexts/NotificationContext';

export interface NotificationPayload {
  type: 'transaction' | 'security' | 'promotional' | 'system';
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private listeners: ((payload: NotificationPayload) => void)[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Subscribe to notification events
   */
  subscribe(listener: (payload: NotificationPayload) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Trigger a new notification
   */
  notify(payload: NotificationPayload): void {
    this.listeners.forEach(listener => listener(payload));
  }

  /**
   * Handle transaction notifications
   */
  notifyTransaction(data: {
    type: 'sent' | 'received' | 'failed' | 'success';
    amount: number;
    recipient?: string;
    sender?: string;
    description?: string;
  }): void {
    let title = '';
    let message = '';
    
    switch (data.type) {
      case 'received':
        title = 'Money Received';
        message = `You received ₦${data.amount.toLocaleString()}${data.sender ? ` from ${data.sender}` : ''}`;
        break;
      case 'sent':
        title = 'Money Sent';
        message = `You sent ₦${data.amount.toLocaleString()}${data.recipient ? ` to ${data.recipient}` : ''}`;
        break;
      case 'success':
        title = 'Transaction Successful';
        message = data.description || `Your transaction of ₦${data.amount.toLocaleString()} was successful`;
        break;
      case 'failed':
        title = 'Transaction Failed';
        message = data.description || `Your transaction of ₦${data.amount.toLocaleString()} failed`;
        break;
    }

    this.notify({
      type: 'transaction',
      title,
      message,
      data,
    });
  }

  /**
   * Handle security notifications
   */
  notifySecurity(data: {
    type: 'login' | 'pin-change' | 'suspicious' | 'alert';
    description: string;
  }): void {
    let title = '';
    
    switch (data.type) {
      case 'login':
        title = 'New Login Detected';
        break;
      case 'pin-change':
        title = 'PIN Changed';
        break;
      case 'suspicious':
        title = 'Suspicious Activity';
        break;
      case 'alert':
        title = 'Security Alert';
        break;
    }

    this.notify({
      type: 'security',
      title,
      message: data.description,
      data,
    });
  }

  /**
   * Handle promotional notifications
   */
  notifyPromotion(data: {
    title: string;
    message: string;
  }): void {
    this.notify({
      type: 'promotional',
      title: data.title,
      message: data.message,
      data,
    });
  }

  /**
   * Handle system notifications
   */
  notifySystem(data: {
    type: 'verification' | 'update' | 'maintenance' | 'info';
    message: string;
  }): void {
    let title = '';
    
    switch (data.type) {
      case 'verification':
        title = 'Account Verification';
        break;
      case 'update':
        title = 'App Update';
        break;
      case 'maintenance':
        title = 'Maintenance Notice';
        break;
      case 'info':
        title = 'Information';
        break;
    }

    this.notify({
      type: 'system',
      title,
      message: data.message,
      data,
    });
  }

  /**
   * Map notification type to toast type
   */
  getToastType(notificationType: string, subType?: string): NotificationType {
    switch (notificationType) {
      case 'transaction':
        if (subType === 'failed') return 'error';
        if (subType === 'received') return 'success';
        return 'transaction';
      case 'security':
        if (subType === 'suspicious' || subType === 'alert') return 'warning';
        return 'info';
      case 'promotional':
        return 'info';
      case 'system':
        if (subType === 'maintenance') return 'warning';
        return 'info';
      default:
        return 'info';
    }
  }
}

export default NotificationService.getInstance();
