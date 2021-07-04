(function() {
  (function() {
    var $, ContactForm, blurHandler, focusHandler, form, i, j, label, len, len1, moduleInput, ref, ref1, results, submit;
    $ = this.jQuery;
    ContactForm = this.ContactForm;
    ref = $('._4ORMAT_module_contact_input:not(.btn)');
    for (i = 0, len = ref.length; i < len; i++) {
      moduleInput = ref[i];
      if ($(moduleInput).val() !== "") {
        $(moduleInput).parent().addClass("_4ORMAT_module_input_active");
      }
    }
    focusHandler = function(e) {
      return $(e.target).parent().addClass("_4ORMAT_module_input_active");
    };
    blurHandler = function(e) {
      if ($(e.target).val() === "" || $(e.target).val() === null) {
        return $(e.target).parent().removeClass("_4ORMAT_module_input_active");
      } else {

      }
    };
    ref1 = $("[data-editable-type='contact-form']");
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      form = ref1[j];
      form.addEventListener('focus', focusHandler, true);
      form.addEventListener('blur', blurHandler, true);
      $(form).find('._4ORMAT_content_page_form_button').bind('click', function(e) {
        return ContactForm.submitHandler($(e.target).closest('form')[0]);
      });
      results.push((function() {
        var k, len2, ref2, results1;
        ref2 = $(form).find('input[type=submit]');
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          submit = ref2[k];
          label = $.trim($(submit).siblings('._4ORMAT_module_contact_label  ').text());
          results1.push($(submit).val(label));
        }
        return results1;
      })());
    }
    return results;
  }).call(_4ORMAT);

}).call(this);
