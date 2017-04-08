'use strict';

var newsSites = [
  '9gag.com', // TODO: Delet this
  'emol.com',
  'elmostrador.cl',
  'publimetro.cl',
  'eldinamo.cl',
  't13.cl',
  'ciperchile.cl',
  'lasegunda.com',
];

jQuery.each(newsSites, function (i) {
  newsSites[i] = sprintf('[href*="%s"]', newsSites[i]);
});

var anchorSelector = sprintf('div[id*=hyperfeed_story_id] div[role=article] a%s', newsSites.join(','));

var injectionTopNewsEnabled = true;
var injectionMorePagerEnabled = true;

var updateStories = function (element) {
  var s = $(element).find(anchorSelector)
    .closest('div[role=article]')
    .parent()
    .parent();

  injectionTopNewsEnabled = false;
  injectionMorePagerEnabled = false;

  s.each(function (i, e) {
    if ($(e).parent().find('div[class="totb-container"]').length > 0) {
      return;
    }
    $(e).after('<div class="totb-container" style="margin: 10px 2px; padding: 10px 15px; background-color: black; color: white;">Esta es una prueba</div>');
  });

  injectionTopNewsEnabled = true;
  injectionMorePagerEnabled = true;
};

$('body').on('DOMSubtreeModified', 'div[id*=topnews_main_stream]', function () {
  if (injectionTopNewsEnabled) {
    injectionTopNewsEnabled = false;
    updateStories(this);
    injectionTopNewsEnabled = true;
  }
});

$('body').on('DOMSubtreeModified', 'div[id*=more_pager_pagelet]', function () {
  if (injectionMorePagerEnabled) {
    injectionMorePagerEnabled = false;
    updateStories(this);
    injectionMorePagerEnabled = true;
  } 
});
