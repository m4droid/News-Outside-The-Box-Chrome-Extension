'use strict';

var injectionEnabled = true;

var updateStories = function (element) {
  var s = $(element).find('div[id*=hyperfeed_story_id] div[role=article] a[href*="9gag.com"],[href*="gph.is"]')
    .closest('div[role=article]')
    .parent()
    .parent();

  injectionEnabled = false;
  s.each(function (i, e) {
    if ($(e).parent().find('div[class="totb-container"]').length > 0) {
      return;
    }
    $(e).after('<div class="totb-container" style="margin: 10px 2px; padding: 10px 15px; background-color: black; color: white;">Esta es una prueba</div>');
  });
  injectionEnabled = true;
};

$('body').on('DOMSubtreeModified', 'div[id*=topnews_main_stream]', function () {
  if (injectionEnabled) {
    updateStories(this);
  }
});

$('body').on('DOMSubtreeModified', 'div[id*=more_pager_pagelet]', function () {
  if (injectionEnabled) {
    updateStories(this);
  } 
});
