////////////////////////////////////////////////////////////////////////////////
'use strict';

//
//import jQuery from 'jquery';


// Project-specific styles

import './js/components/date-picker';

// Project-specific JS
import Store from './js/store';
import Router from './js/router';
import Utils from './js/utils';

import './js/components/date-picker';

Router.use(Store);

// set in global scope
window.Store = Store;
window.Router = Router;
window.Utils = Utils;