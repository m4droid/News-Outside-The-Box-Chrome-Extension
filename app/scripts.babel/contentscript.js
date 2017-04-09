'use strict';

var newsSites = [
  'cooperativa.cl',
  'elmostrador.cl',
  'emol.com',
  'latercera.com',
  'theclinic.cl',
  'elciudadano.cl'
];

for (var a in newsSites) {
  newsSites[a] = sprintf('[href*="%s"]', newsSites[a]);
}

var template = '<div class="totb-container" style="margin: 10px 1px; padding: 10px 15px; background-color: #202020; color: white; border-radius: 2px;"><h1 style="font-size: 1.6rem; color: #ccc;">Think Outside The Box</h1><h2 style="margin: 10px 0; color: #ddd;">Noticias relacionadas desde la otra vereda</h2>%s</div>';
var linkTemplate = '<p><a style="color: #80a9f7;" href="%s" target="_blank">%s</a></p>';

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

    var linkElement = $(e).find(sprintf('a._52c6%s', newsSites.join(',')));

    var url = linkElement.attr('href');
    var header = linkElement.siblings('._6m3').find('._6m6').text();
    var subheader = linkElement.siblings('._6m3').find('._6m6').text();

    $.ajax({
      method: 'POST',
      url: 'https://totb.m4droid.com/news',
      async: false,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({
        url: url,
        header: header,
        subheader: subheader
      })
    }).done(function (data) {
      if ( ! data) {
        return;
      }

      var compile = null;

      if (data.length !== 0) {
        for (var i in data) {
          data[i] = sprintf(linkTemplate, data[i]._source.url, data[i]._source.header);
        }
        compile = sprintf(template, data.join(''));
      } else {
        compile = sprintf(template, '<p>No se encontraron noticias</p>');
      }

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
