import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ServerEvent {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private eventSource: EventSource | null = null;
  private connectionId: string | null = null;
  private XELFLOW_API_URL = 'https://sanme.azurewebsites.net';

  // Signal to track connection status
  public status: WritableSignal<'disconnected' | 'connecting' | 'connected' | 'error'> = signal('disconnected');
  public isRegistered: WritableSignal<boolean | null> = signal(null);

  // Subject for incoming events
  private eventSubject = new Subject<ServerEvent>();
  public events$: Observable<ServerEvent> = this.eventSubject.asObservable();

  constructor() {
    // Cleanup on browser close
    window.addEventListener('beforeunload', () => {
      this.disconnect();
    });
  }

  /**
   * Initialize connection by getting ID and starting SSE stream
   */
  async initConnection(): Promise<string> {
    if (this.connectionId) return this.connectionId;

    this.status.set('connecting');

    try {
      const response = await fetch('/api/connections');
      if (!response.ok) {
        throw new Error(`Failed to fetch connectionId: ${response.statusText}`);
      }

      this.isRegistered.set(response.status !== 202);
      this.connectionId = await response.json();
      console.log('Established connectionId:', this.connectionId);

      this.startStream(this.connectionId!);
      return this.connectionId!;
    } catch (error) {
      console.error('Connection initialization failed:', error);
      this.status.set('error');
      throw error;
    }
  }

  /**
   * Start the SSE stream
   */
  private startStream(connectionId: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const streamUrl = this.XELFLOW_API_URL + `/api/events/stream?connectionId=${connectionId}`;
    this.eventSource = new EventSource(streamUrl);

    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
      this.status.set('connected');
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      this.status.set('error');
      // Reconnection logic as per readme.md
      setTimeout(async () => {
        if (this.status() === 'error') {
          this.connectionId = null;
          await this.initConnection();
        }
      }, 1000);
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.eventSubject.next({ event: 'message', data });
      } catch (e) {
        this.eventSubject.next({ event: 'message', data: event.data });
      }
    };
  }

  /**
   * Send an event to the server
   */
  async sendEvent(eventName: string, data: any = {}, version: string = '1.0'): Promise<void> {
    if (!this.connectionId) {
      throw new Error('No connectionId established. Call initConnection() first.');
    }

    const payload = {
      connectionId: this.connectionId,
      event: eventName,
      version: version,
      data: data
    };

    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send event: ${response.status} ${errorText}`);
    }
  }

  /**
   * Close connection
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.status.set('disconnected');
    this.connectionId = null;
  }

  /**
   * Helper to add specific event listeners dynamically
   */
  addEventListener(eventName: string): void {
    if (this.eventSource) {
      this.eventSource.addEventListener(eventName, this.eventSubjectNext);
    }
  }

  private eventSubjectNext = (event: any) => {
    try {
      const data = JSON.parse(event.data);
      this.eventSubject.next({event: event.type, data});
    } catch (e) {
      this.eventSubject.next({event: event.type, data: event.data});
    }
  }
}
