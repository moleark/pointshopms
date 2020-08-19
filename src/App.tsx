import * as React from 'react';
import './App.css';
import { NavView, start, nav } from 'tonva';
import { CPointMallApp } from "CPointMallApp";
import { appConfig } from 'configuration';

nav.setSettings(appConfig);
class App extends React.Component {

  private onLogined = async () => {
    await start(CPointMallApp, appConfig);
  }

  public render() {
    return <NavView onLogined={this.onLogined} />
  }
}

export default App;
