/*
Copyright 2017 Super Adventure Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/nafundi/super-adventure/blob/master/NOTICE.

This file is part of Super Adventure. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of Super Adventure,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import Vue from 'vue';
import VueRouter from 'vue-router';

import FormList from './components/form/list.vue';
import FormNew from './components/form/new.vue';
import FormEdit from './components/form/edit.vue';

import SessionLogin from './components/session/login.vue';

import SubmissionList from './components/submission/list.vue';

import NotFound from './components/not-found.vue';



////////////////////////////////////////////////////////////////////////////////
// ROUTES

const routes = [
  { path: '/', redirect: '/forms' },

  { path: '/login', component: SessionLogin },

  { path: '/forms', component: FormList },
  { path: '/forms/new', component: FormNew },
  { path: '/forms/:xmlFormId/edit', component: FormEdit },

  { path: '/forms/:xmlFormId/submissions', component: SubmissionList },

  { path: '*', component: NotFound }
];



////////////////////////////////////////////////////////////////////////////////
// INITIALIZE

Vue.use(VueRouter);
const router = new VueRouter({ routes });



////////////////////////////////////////////////////////////////////////////////
// LOGIN

router.beforeEach((to, from, next) => {
  if (router.app.$session.isLoggedOut()) {
    if (to.path === '/login') {
      // If you are logged out and are navigating to login, you are going to the
      // right place.
      next();
    } else {
      // If you are logged out and are navigating somewhere other than login,
      // you need to log in first.
      next({ path: '/login', query: { next: to.path } });
    }
  } else {
    if (to.path === '/login') { // eslint-disable-line no-lonely-if
      // If you are logged in, you cannot revisit the login page.
      next('/forms');
    } else {
      // If you are logged in, you may navigate beyond the login page.
      next();
    }
  }
});



////////////////////////////////////////////////////////////////////////////////
// EXPORT

export default router;