(function() {
  (function() {
    var $, APIClient, instagram;
    $ = this.jQuery;
    APIClient = (function() {
      function APIClient(accessToken1, apiPrologue) {
        this.accessToken = accessToken1 != null ? accessToken1 : null;
        this.apiPrologue = apiPrologue != null ? apiPrologue : "https://graph.instagram.com/me";
        if (this.accessToken == null) {
          throw new Error("You must provide an accessToken parameter when instantiating an APIClient object.");
        }
      }

      APIClient.prototype.requestEndpoint = function(endpoint) {
        var apiEndpoint;
        apiEndpoint = endpoint.indexOf("?") > 0 ? endpoint + "&access_token=" + this.accessToken : endpoint + "/?access_token=" + this.accessToken;
        return $.ajax({
          url: this.apiPrologue + "/" + apiEndpoint,
          dataType: "jsonp"
        });
      };

      APIClient.prototype.getRecentMedia = function(count) {
        var params, url;
        url = this.apiPrologue;
        params = {
          dataType: "jsonp",
          data: {
            access_token: this.accessToken,
            fields: "media.limit(" + count + "){media_url,permalink,thumbnail_url,username}"
          }
        };
        return this.fetchDataUntilGotEnough(url, params, count);
      };

      APIClient.prototype.fetchDataUntilGotEnough = function(url, params, count) {
        var deferred, handleError, handleResponse, recursiveInstagramFetcher, result;
        result = [];
        deferred = $.Deferred();
        handleResponse = function(response) {
          var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
          result = result.concat((ref = response != null ? (ref1 = response.media) != null ? ref1.data : void 0 : void 0) != null ? ref : []);
          if ((response != null ? response.error : void 0) != null) {
            return deferred.resolve(response);
          } else if (result.length >= count) {
            return deferred.resolve({
              data: result,
              count: count
            });
          } else if ((response != null ? (ref2 = response.media) != null ? (ref3 = ref2.data) != null ? ref3.length : void 0 : void 0 : void 0) && ((response != null ? (ref4 = response.media) != null ? (ref5 = ref4.paging) != null ? ref5.next : void 0 : void 0 : void 0) == null)) {
            if (typeof Raven !== "undefined" && Raven !== null) {
              Raven.captureMessage('Instagram account doesn’t have enough images');
            }
            return deferred.resolve({
              data: result
            });
          } else if ((response != null ? (ref6 = response.media) != null ? (ref7 = ref6.paging) != null ? ref7.next : void 0 : void 0 : void 0) != null) {
            return recursiveInstagramFetcher(response.media.paging.next);
          } else {
            return deferred.resolve(instagram.constructError(instagram.UNKNOWN_ERROR));
          }
        };
        handleError = function(error) {
          try {
            return deferred.resolve(JSON.parse(error.responseText));
          } catch (error1) {
            return deferred.resolve(instagram.constructError(instagram.UNKNOWN_ERROR));
          }
        };
        recursiveInstagramFetcher = function(url, params) {
          if (params == null) {
            params = {
              dataType: 'jsonp'
            };
          }
          return $.ajax(url, params).then(handleResponse, handleError);
        };
        recursiveInstagramFetcher(url, params);
        return deferred;
      };

      return APIClient;

    })();
    instagram = this.instagram = {
      NO_ACCESS_TOKEN_ERROR: "IGApiException",
      INVALID_ACCESS_TOKEN_ERROR: "OAuthException",
      UNKNOWN_ERROR: "unknown",
      constructError: function(type) {
        return {
          error: {
            type: type
          }
        };
      },
      config: (function(_this) {
        return function() {
          var ref, ref1;
          return (ref = _this.social) != null ? (ref1 = ref.instagram) != null ? ref1.accessToken : void 0 : void 0;
        };
      })(this),
      populate: function($modules, cb) {
        var $instagramModule, accessToken, instagramClient;
        if ($modules != null) {
          $modules = $modules.filter(function(_, el) {
            return $(el).find("[data-social-type='instagram']").length === 1;
          });
        }
        $instagramModule = $modules != null ? $modules : $("[data-social-type='instagram']").closest("._4ORMAT_content_page_row");
        if (!($instagramModule.length > 0)) {
          return;
        }
        accessToken = instagram.config();
        if (accessToken == null) {
          instagram.render({
            el: $instagramModule,
            error: instagram.NO_ACCESS_TOKEN_ERROR
          });
          return typeof cb === "function" ? cb($instagramModule) : void 0;
        }
        instagramClient = new APIClient(accessToken);
        return $instagramModule.each(function(_, el) {
          var imageCount, instagramWrapper, ref;
          instagramWrapper = $(el).find(".js-format-instagram-wrapper")[0];
          imageCount = (ref = instagramWrapper.dataset.imageCount) != null ? ref : 6;
          return instagramClient.getRecentMedia(imageCount).then(function(response) {
            if ((response != null ? response.error : void 0) != null) {
              instagram.render({
                el: el,
                error: response.error.type
              });
            } else {
              instagram.render({
                data: response.data,
                el: el,
                settings: instagramWrapper.dataset
              });
            }
            return typeof cb === "function" ? cb($(el)) : void 0;
          });
        });
      },
      updateImageCount: function(el, settings, cb) {
        var accessToken, imageCount, instagramClient, ref;
        accessToken = instagram.config();
        if (accessToken == null) {
          instagram.render({
            el: el,
            error: instagram.NO_ACCESS_TOKEN_ERROR
          });
          return typeof cb === "function" ? cb($(el)) : void 0;
        }
        instagramClient = new APIClient(accessToken);
        imageCount = (ref = settings.imageCount) != null ? ref : 6;
        return instagramClient.getRecentMedia(imageCount).then(function(response) {
          if ((response != null ? response.error : void 0) != null) {
            instagram.render({
              el: el,
              error: response.error.type
            });
          } else {
            instagram.render({
              data: response.data,
              el: el,
              settings: settings
            });
          }
          return typeof cb === "function" ? cb($(el)) : void 0;
        });
      },
      render: function(arg) {
        var $el, $instagramContainer, content, data, el, error, settings;
        settings = arg.settings, data = arg.data, el = arg.el, error = arg.error;
        content = error != null ? error === instagram.NO_ACCESS_TOKEN_ERROR ? "<div class='js-format-instagram-container format-instagram-container error error-no-access'>\n</div>" : error === instagram.INVALID_ACCESS_TOKEN_ERROR ? "<div class='js-format-instagram-container format-instagram-container error error-failed-access'>\n</div>" : "<div class='js-format-instagram-container format-instagram-container error error-unknown empty'>\n</div>" : data.length === 0 ? "<div class='js-format-instagram-container format-instagram-container error empty'>\n</div>" : instagram.renderImages({
          data: data,
          el: el,
          settings: settings
        });
        $el = $(el);
        $instagramContainer = $el.find(".js-format-instagram-container ");
        if ($instagramContainer.length > 0) {
          $instagramContainer.replaceWith(content);
        } else {
          $el.find(".js-format-instagram-wrapper").append(content);
        }
        return $el.toggleClass("_4ORMAT_site_hidden", (error != null) || data.length === 0);
      },
      renderImages: function(arg) {
        var data, el, items, ref, settings;
        data = arg.data, el = arg.el, settings = arg.settings;
        items = data.reduce(function(res, post) {
          return res + ("<div class=\"format-instagram-preview\">\n  <a href=\"" + post.permalink + "\" target=\"_blank\" rel=\"noopener\">\n    <div class=\"format-instagram-preview-image\"\n      style=\"background-image:url(" + (post.thumbnail_url || post.media_url) + ");\"></div>\n  </a>\n</div>");
        }, "");
        items = items + instagram.renderAttribution(data);
        return "<div class='js-format-instagram-container format-instagram-container image-row-count-" + ((ref = settings.imagesPerRow) != null ? ref : 3) + "'>\n  " + items + "\n</div>";
      },
      renderAttribution: function(data) {
        if (!(data.length > 0)) {
          return "";
        }
        return "<div class=\"format-instagram-attribution\">\n  Follow\n  <a href=\"https://www.instagram.com/" + data[0].username + "/\" target=\"_blank\" rel=\"noopener\">@" + data[0].username + "</a>\n  on Instagram\n</div>";
      }
    };
    return $(function() {
      if (!_4ORMAT_DATA.page.content_editable) {
        return instagram.populate();
      }
    });
  }).call(_4ORMAT);

}).call(this);
