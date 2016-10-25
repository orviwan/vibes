'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import '../styles/index.scss';

var domready = require('detect-dom-ready');
var Vibes = require('./vibes');

domready(function() {
  var vibes = new Vibes('Vibes');
});



