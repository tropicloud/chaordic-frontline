
// Author: Guilherme Jaccoud <admin@tropicloud.net>
// Author URI: http://tapioca.ws
// Description: Chaordic Frontline
// Version: 0.4.9

var css = '<link rel="stylesheet" href="//cdn.rawgit.com/tropicloud/chaordic-frontline/master/0.4.9/frontline.css">';
var js1 = $.getScript('//cdn.jsdelivr.net/jquery.slick/1.5.8/slick.min.js');
var js2 = $.getScript('//cdn.jsdelivr.net/mustache.js/2.1.3/mustache.min.js');
var js3 = $.getScript('//cdn.jsdelivr.net/jquery.truncate/0.1/jquery.truncate.min.js');

$('head').append(css);
$.when( js1, js2, js3 )
 .then(function () {
   $('.chaordic-container').each(function () {
    var id = '#' + $(this).attr('id');
    var endpoint = $(this).attr('endpoint');
    var template = $(this).attr('template');
    $.when(
      $.get(template),
      $.getJSON(endpoint)
    ).then(function (template,response) {

      // Discounts (does the platform handle this?)
      var reference = response[0].data.reference;
      var recommendation = response[0].data.recommendation;
      $.each([reference,recommendation], function() {
        $.each(this, function(i,item) {
          onsiteDiscount(item);
        });
      });

      var containerTemplate = $(template[0]).filter('#onsite-container').html();
      var referenceTemplate = $(template[0]).filter('#onsite-reference').html();
      var recommendTemplate = $(template[0]).filter('#onsite-recommend').html();
      var containerRender = Mustache.render(containerTemplate, response[0].data);
      var referenceRender = Mustache.render(referenceTemplate, response[0].data);
      var recommendRender = Mustache.render(recommendTemplate, response[0].data);
      $(id).html(containerRender);
      $(id).find('.chaordic-ref').html(referenceRender).slick();
      $(id).find('.chaordic-rec').html(recommendRender).slick(onsiteOpt.carousel);
      $(id).find('.chaordic-item .name').truncate(onsiteOpt.truncation);
    });
  });
});

function onsiteDiscount(item) {
  if(item.oldPrice) {
    var priceOld = item.oldPrice.replace(/\D/g,'');
    var priceNew = item.price.replace(/\D/g,'');
    var decrease = ( priceOld - priceNew ) / priceOld * 100;
    item.discount = Math.floor(decrease) + '%';
  }
}
