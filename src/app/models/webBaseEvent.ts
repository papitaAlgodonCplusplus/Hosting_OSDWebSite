import { EventConstants } from './eventConstants';
import { EventType } from './eventType';

interface EventBody {
  [key: string]: any;
}

export class WebBaseEvent {
  public SessionKey: string = "";
  public SecurityToken: string = "";
  public Body: EventBody;

  constructor()
  {
    this.Body = {
    };
  }

  get TraceIdentifier(): string {
    return this.Body[EventConstants.TRACE_IDENTIFIER];
  }
  set TraceIdentifier(value: string) {
    this.Body[EventConstants.TRACE_IDENTIFIER] = value;
  }

  get Type(): EventType {
    return this.Body[EventConstants.TYPE];
  }

  set Type(value: EventType) {
    this.Body[EventConstants.TYPE] = value;
  }

  get Action(): string {
    return this.Body[EventConstants.ACTION];
  }
  set Action(value: string) {
    this.Body[EventConstants.ACTION] = value;
  }

  get Date(): string {
    return this.Body[EventConstants.DATE];
  }

  set Date(value: string) {
    this.Body[EventConstants.DATE] = value;
  }

  get ApplicationIdentifier(): string {
    return this.Body[EventConstants.APPLICATION_IDENTIFIER];
  }
  set ApplicationIdentifier(value: string) {
    this.Body[EventConstants.APPLICATION_IDENTIFIER] = value;
  }

  public setBodyProperty(key:string, value:any) {
    this.Body[key] = value;
  }
  public getBodyProperty(key:string) {
    return this.Body[key];
  }
}
