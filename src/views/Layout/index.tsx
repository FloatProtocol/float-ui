import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Phase1View from 'views/Phase1';
import TopBar from 'components/TopBar/TopBar';
import Footer from 'components/Footer/Footer';
import SplashView from 'views/Splash';

import config from 'assets/config.json';

const NormalView: React.FC = ({ children }) => {
  return <div className="App">
    <TopBar/>
    {children}
    <Footer/>
  </div>;
}

const LayoutView: React.FC = () => {
  const now = new Date();

  return (
    <>
      <Switch>
        <Redirect exact from="/" to="/stake" />
        <Route path="/stake">
          <NormalView>
            <Phase1View />
          </NormalView>
        </Route>
        <Route path="/splash">
          <SplashView toTime={config.phase_1_start}/>
        </Route>
      </Switch>
    </>
  );
}

export default LayoutView;