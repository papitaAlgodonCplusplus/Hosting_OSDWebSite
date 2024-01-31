import { EventComponent } from './eventComponent';


interface EventBody {
  [key: string]: any;
}

export class NotificationEvent{
    public TraceIdentifier : string = "";
    public Component!: EventComponent;
    public Action : string = "";
    public Message : string = "";
    public Body : EventBody;

    constructor(){
        this.Body = {};
    }

    public setBodyProperty(key:string, value:any) {
        this.Body[key] = value;
    }
    public getBodyProperty(key:string) {
      return this.Body[key];
    }
}
