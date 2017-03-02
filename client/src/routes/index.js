/*
	Routes 路由配置
*/
import React from 'react';
import {
  Router,
  browserHistory
} from 'react-router';

const routes = {
  childRoutes: [
    //  首页
    {
      path: '/',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require('PAGES/home').default);
        }, 'home');
      }
    }
  ]
};

export default < Router history = {
  browserHistory
}
routes = {
  routes
}
/>;