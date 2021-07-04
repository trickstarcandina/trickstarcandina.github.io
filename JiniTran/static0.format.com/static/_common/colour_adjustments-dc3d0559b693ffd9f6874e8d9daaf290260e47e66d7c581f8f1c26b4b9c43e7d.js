(function () {
// Grab css color from module & set variables
  var module = document.querySelector('._4ORMAT_content_page_row');

  if (module != null) {

    var theme = document.querySelector('body'),
      inputBorders = document.querySelectorAll('._4ORMAT_module_contact_input'),
      dividerLight = document.querySelectorAll('._4ORMAT_module_divider_color_light'),
      dividerSolid = document.querySelectorAll('._4ORMAT_module_divider_color_solid'),
      dividerBackground = document.querySelectorAll('._4ORMAT_module_divider_color_background'),
      dividerSVG = document.querySelectorAll('._4ORMAT_module_svg_divider_fill'),
      contactBtn = document.querySelectorAll('.btn'),
      borderColor = window.getComputedStyle(module, null).getPropertyValue("color"),
      bgColor = window.getComputedStyle(theme, null).getPropertyValue("background-color"),
      fontFamily = window.getComputedStyle(module, null).getPropertyValue("font-family"),
      opacity = 0.3, // Opacity of converted rgba color
      inputHoveredBorderOpacity = 0.4,
      inputHoveredBackgroundOpacity = 0.03;

    // Make sure the color isn't already in RGBA
    if (borderColor.indexOf('rgba') == -1) {
      // Convert RGB to RGBA
      var borderColorRGBA = borderColor.replace(')', ', ' + opacity + ')').replace('rgb', 'rgba');
    }

    // Color contact module form field borders
    for (var i = 0, len = inputBorders.length; i < len; i++) {
      inputBorders[i].style.borderColor = borderColorRGBA;
    }

    // Color contact module buttons
    for (var i = 0, len = contactBtn.length; i < len; i++) {
      // var css='._4ORMAT_content_page_row .btn:hover{border-color: red}';
      var inputHoveredBackground = borderColor
        .replace(")", ", " + inputHoveredBackgroundOpacity + ")")
        .replace("rgb", "rgba");
      var inputHoveredBorder = borderColor.replace(")", ", " + inputHoveredBorderOpacity + ")").replace("rgb", "rgba");
      var css =
        "._4ORMAT_content_page_row .btn {font-family:" +
        fontFamily +
        "}._4ORMAT_content_page_row .btn:hover {border-color: " +
        inputHoveredBorder +
        " !important;background:" +
        inputHoveredBackground +
        " !important;}";
      var style = document.createElement('style');
      if (style.styleSheet)
        style.styleSheet.cssText = css;
      else
        style.appendChild(document.createTextNode(css));
      document.getElementsByTagName('head')[0].appendChild(style);
    }

    // Color borders
    for (var i = 0, len = dividerLight.length; i < len; i++) {
      dividerLight[i].style.borderColor = borderColorRGBA;
    }
    for (var i = 0, len = dividerSolid.length; i < len; i++) {
      dividerSolid[i].style.borderColor = borderColor
    }
    for (var i = 0, len = dividerSVG.length; i < len; i++) {
      dividerSVG[i].style.fill = borderColor
    }
    for (var i = 0, len = dividerBackground.length; i < len; i++) {
      dividerBackground[i].style.background = borderColor
    }
  }
})();
