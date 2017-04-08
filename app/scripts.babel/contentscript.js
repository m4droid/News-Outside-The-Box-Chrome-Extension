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

for (var a in newsSites) {
  newsSites[a] = sprintf('[href*="%s"]', newsSites[a]);
}

var template = '<div class="totb-container" style="margin: 10px 1px; padding: 10px 15px; background-color: #202020; color: white; border-radius: 2px;"><h1 style="font-size: 1.6rem; color: #ccc;">Think Outside The Box</h1><h2 style="margin: 10px 0; color: #ddd;">Noticias relacionadas desde la otra vereda</h2><ul>%s</ul></div>';
var linkTemplate = '<a style="color: #80a9f7;" href="%s">%s</a>';

var anchorSelector = sprintf('div[id*=hyperfeed_story_id] div[role=article] a%s', newsSites.join(','));

var _LOCKS = {
  'TOP_NEWS': false,
  'MORE_PAGES': false
};

var updateStories = function (lockName, element) {

  if (_LOCKS[lockName]) {
    return;
  }

  _LOCKS[lockName] = true;

  // TODO: refactor this
  var s = element.find(anchorSelector).closest('div[role=article]').parent().parent();

  s.each(function (i, e) {
    if ($(e).parent().find('div[class="totb-container"]').length > 0) {
      _LOCKS[lockName] = false;
      return;
    }

    $.ajax({
      url: 'https://totb.m4droid.com/news',
      async: false
    }).done(function (data) {
      var news = data;
      console.log(data);

      for (var i in news) {
        news[i] = sprintf(linkTemplate, news[i]._source.url, news[i]._source.header);
      }

      var compile = sprintf(template, news.join(''));

      $(e).after(compile);
    });
  });

  _LOCKS[lockName] = false;
};

$('body').on('DOMSubtreeModified', 'div[id*=topnews_main_stream]', function () {
  updateStories('TOP_NEWS', $(this));
});

$('body').on('DOMSubtreeModified', 'div[id*=more_pager_pagelet]', function () {
  updateStories('MORE_PAGES', $(this));
});

// setInterval(
//   function () {
//     updateStories('TOP_NEWS', $('div[id*=topnews_main_stream]'));
//   },
//   500
// );

// setInterval(
//   function () {
//     updateStories('MORE_PAGES', $('div[id*=more_pager_pagelet]'));
//   },
//   500
// );
