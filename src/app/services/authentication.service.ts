import { Injectable } from '@angular/core';
import { UserInfo } from '../models/userInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor()
  {
    localStorage.removeItem('sessionKey');
    localStorage.removeItem('userInfo');
  }

  //Correccion temporal 
  public initialize(sessionlessKey : string)
  {
    localStorage.setItem('sessionlessKey', sessionlessKey);
    localStorage.setItem('sk', sessionlessKey);
  }

  public startSession(sessionKey : string)
  {
    localStorage.setItem('sessionKey', sessionKey);
    localStorage.removeItem('sessionlessKey');
  }

  public endSession(sessionlessKey : string)
  {
    localStorage.removeItem('sessionKey');
    localStorage.removeItem('userInfo');
    localStorage.setItem('sessionlessKey', sessionlessKey);
  }

  get sessionKey() : string
  {
    let sessionKey : string | null;

    sessionKey = localStorage.getItem('sessionKey');
    if(sessionKey == undefined)
    {
      sessionKey = localStorage.getItem('sessionlessKey');
      if(sessionKey == undefined)
      {
        sessionKey = "";
      }
    }
    return sessionKey;
  }

  public isAuthenticated(): boolean
  {
    let sessionKey : string | null;

    sessionKey = localStorage.getItem('sessionKey');
    if(sessionKey == undefined)
      return false;
    else
      return true;
  };

  get userInfo(): UserInfo | null {
    let userInfo: UserInfo | null = null;

    const userInfoString = localStorage.getItem('userInfo');

    if (userInfoString !== null) {
      userInfo = JSON.parse(userInfoString);
    }

    return userInfo;
  }

  set userInfo(value: UserInfo)
  {
    localStorage.setItem('userInfo', JSON.stringify(value));
  }
}
