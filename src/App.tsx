import * as React from 'react';
import './App.css';
import { NavView, start, nav } from 'tonva';
import { CPointShopMsApp } from "CPointShopMsApp";
import { appConfig } from 'configuration';

nav.setSettings(appConfig);
class App extends React.Component {

  private onLogined = async () => {
    await start(CPointShopMsApp, appConfig);
  }

  public render() {
    return <NavView onLogined={this.onLogined} /> /* notLogined={this.onLogined} */
  }
}

export default App;
