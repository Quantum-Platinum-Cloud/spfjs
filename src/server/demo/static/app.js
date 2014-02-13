/**
 * @fileoverview JavaScript for the SPF demo app.
 *
 * @author nicksay@google.com (Alex Nicksay)
 */


/**
 * The demo app namespace.
 * @type {Object}
 */
var app = app || {};


/**
 * Initialize the demo app.
 */
app.init = function() {
  app.start_ = +new Date();
  app.timer_ = window.setInterval(app.updateTime, 500);
  var config = {
    'process-async': true,
    'navigate-requested-callback': app.handleNavigateRequested,
    'navigate-part-received-callback': app.handleNavigatePartReceived,
    'navigate-part-processed-callback': app.handleNavigatePartProcessed,
    'navigate-received-callback': app.handleNavigateReceived,
    'navigate-processed-callback': app.handleNavigateProcessed,
    'navigate-error-callback': app.handleNavigateError,
    'script-loading-callback': app.handleScriptLoading,
    'style-loading-callback': app.handleStyleLoading
  };
  app.enabled = spf.init(config);
  app.updateStatus();
};


/**
 * Dispose the demo app.
 */
app.dispose = function() {
  window.clearInterval(app.timer_);
  app.start_ = 0;
  app.enabled = false;
  app.updateStatus();
  app.updateTime();
};


/**
 * Simple central logging function for the demo app.
 * @param {string} msg Message to log.
 */
app.log = function(msg) {
  if (window.console) {
    window.console.log('[app] ' + msg);
  }
};


/**
 * Update the display showing whether SPF is enabled.
 */
app.updateStatus = function() {
  var statusEl = document.getElementById('app-status');
  if (statusEl) {
    if (app.enabled) {
      statusEl.innerHTML = 'Enabled';
      statusEl.className = 'enabled';
    } else {
      statusEl.innerHTML = 'Disabled';
      statusEl.className = 'disabled';
    }
  }
};


/**
 * Update the display counting time since last page load.
 */
app.updateTime = function() {
  var timerEl = document.getElementById('app-timer');
  if (timerEl) {
    if (app.start_) {
      var time = Math.floor((+new Date() - app.start_) / 1000);
      timerEl.innerHTML = time;
    } else {
      timerEl.innerHTML = '';
    }
  }
};


/**
 * Callback for when navigate requests are sent.
 * @param {string} url The new URL.
 */
app.handleNavigateRequested = function(url) {
  app.log('navigate requested');
};


/**
 * Callback for when parts of navigate requests are received.
 * @param {string} url The requested URL, without the SPF identifier.
 * @param {Object} part The part of the requested SPF response object.
 */
app.handleNavigatePartReceived = function(url, part) {
  app.log('navigate received part');
};


/**
 * Callback for when parts of navigate responses are processed.
 * @param {string} url The requested URL, without the SPF identifier.
 * @param {Object} part The part of the requested SPF response object.
 */
app.handleNavigatePartProcessed = function(url, part) {
  app.log('navigate procssed part');
};


/**
 * Callback for when navigate responses are received.
 * @param {string} url The requested URL, without the SPF identifier.
 * @param {Object} response The requested SPF response object.
 */
app.handleNavigateReceived = function(url, response) {
  app.log('navigate received');
  // If debug logging is enabled, reset the relative times when each new
  // request is received.
  if (spf.debug) {
    spf.debug.reset();
  }
};


/**
 * Callback for when navigate responses are processed.
 * @param {Object} response The processed SPF response object.
 */
app.handleNavigateProcessed = function(response) {
  app.log('navigate processed');
};


/**
 * Callback for navigate errors.
 * @param {string} url The requested URL, without the SPF identifier.
 * @param {Error} err The Error object.
 */
app.handleNavigateError = function(url, err) {
  app.log('navigate error');
};


/**
 * Callback for script loading.
 * @param {string} url The new script URL.
 * @param {string} name The new script name (to identify it independently of
 *     the URL).
 */
app.handleScriptLoading = function(url, name) {
  app.log('script loading ' + url + ' ' + name);
};

/**
 * Callback for style loading.
 * @param {string} url The new style URL.
 * @param {string} name The new style name (to identify it independently of
 *     the URL).
 */
app.handleStyleLoading = function(url, name) {
  app.log('style loading ' + url + ' ' + name);
};


/**
 * Whether SPF is enabled for the demo app.
 * @type {boolean}
  */
app.enabled = false;


/**
 * The timestamp of when the demo app started.
 * @type {number}
 * @private
 */
app.start_ = 0;


/**
 * The timer counting since last page load.
 * @type {number}
 * @private
 */
app.timer_ = 0;


////////////////////////////////////////////////////////////////////////////////


/**
 * The demo app namespace for the home page.
 * @type {Object}
 */
app.home = app.home || {};


/**
 * Initialize the demo app home page.
 */
app.home.init = function() {
  // Show the correct support notice.
  var id = app.enabled ? 'home-full' : 'home-partial';
  document.getElementById(id).style.display = '';
  // Enable the extra content button.
  var buttonEl = document.getElementById('home-ajax-get');
  buttonEl.onclick = function() {
    spf.load('/index_ajax', {'method': 'POST'});
  };
};