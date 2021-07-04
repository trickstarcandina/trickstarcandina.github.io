_4ORMAT.$(function() {
  var $ = _4ORMAT.$;
  var detectPosition = function() {
    $("._4ORMAT_content_page_row").each(function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      if (elementBottom > viewportTop &&
        (elementTop < viewportBottom || viewportBottom == document.body.scrollHeight)) {
        if (!$(this).hasClass("in-viewport")) {
          $(this).addClass("in-viewport");
        }
      }
    });
  };

  detectPosition();
  $([window, document.body]).on("scroll", function() {
    detectPosition();
  });
});
