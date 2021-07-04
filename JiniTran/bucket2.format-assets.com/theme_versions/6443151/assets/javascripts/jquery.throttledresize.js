/*
 * throttledresize: special jQuery event that happens at a reduced rate compared to "resize"
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work? 
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
!function(i){var s,h,o,a=i.event,l={_:0},d=0;s=a.special.throttledresize={setup:function(){i(this).on("resize",s.handler)},teardown:function(){i(this).off("resize",s.handler)},handler:function(e,t){var n=this,r=arguments;h=!0,o||(setInterval(function(){(++d>s.threshold&&h||t)&&(e.type="throttledresize",a.dispatch.apply(n,r),h=!1,d=0),9<d&&(i(l).stop(),o=!1,d=0)},30),o=!0)},threshold:0}}(jQuery);