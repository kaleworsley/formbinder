(function() {
  // Initial Setup
  // -------------

  // Save a reference to the global object.
  var root = this;

  // Save the previous value of the `FormBinder` variable.
  var previousFormBinder = root.FormBinder;

  // The top-level namespace. All public FormBinder classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var FormBinder;
  if (typeof exports !== 'undefined') {
    FormBinder = exports;
  } else {
    FormBinder = root.FormBinder = {};
  }

  // Current version of the library.
  FormBinder.VERSION = '0.1.0';

  // Runs FormBinder.js in *noConflict* mode, returning the `FormBinder` variable
  // to its previous owner. Returns a reference to this FormBinder object.
  FormBinder.noConflict = function() {
    root.FormBinder = previousFormBinder;
    return this;
  };

  // Sets default options for FormBinder
  FormBinder.options = {
    events: ['change', 'click', 'keypress'],
    attribute: 'data-field-name'
  };


  // FormBinder.bind
  // ---------------

  // Binds change events to form elements
  FormBinder.bind = function(view, options) {
    // Set options
    options = _.extend(FormBinder.options, options);
    // View element
    var el = view.el;
    // Model
    var model = view.model;
    // Loop through each element that has a data-fiel-name attribute
    $('[' + options.attribute + ']', el).each(function() {
      // Get the field/attribute name
      var field_name = $(this).attr(options.attribute);
      // Get all elements that have that field name
      // This is useful for radio buttons and checkboxes
      var this_el = $('[' + options.attribute + '=' + field_name + ']', el);

      // Bind events to model attributes
      $(this_el).bind(options.events.join(' '), function(e) {
        // Get the value of the element using the Get method
        var value = FormBinder.get($(this_el));
        model.changed_attributes || (model.changed_attributes = {});
        // Add this value to the changed_attributes hash
        model.changed_attributes[field_name] = value;
      });

      // Bind value to field
      FormBinder.set($(this_el), (model.get(field_name) || ''));
    });
  };

  // FormBinder.clear
  // ----------------

  // Reverts field values, and resets the changed_attributes hash
  FormBinder.clear = function(view, options) {
    // Set options
    options = _.extend(FormBinder.options, options);
    // View element
    var el = view.el;
    // Model
    var model = view.model;
    $('[' + options.attribute + ']', el).each(function() {
      // Get the field/attribute name
      var field_name = $(this).attr(options.attribute);
      // Get all elements that have that field name
      // This is useful for radio buttons and checkboxes
      var this_el = $('[' + options.attribute + '=' + field_name + ']', el);

      FormBinder.set($(this_el), (model._previousAttributes[field_name] || ''));
    });
    model.changed_attributes = {};
  };


  // FormBinder.get
  // --------------

  // Simple form element setter
  FormBinder.get = function(el) {
    // Multiple checkboxes
    if (el.length > 1 && el.is('input[type=checkbox]')) {
      var val = _.map(el.filter(':checked'), function(checkbox) {
        return $(checkbox).val();
      });
      return val;
    }
    // Single checkbox
    else if (el.is('input[type=checkbox]')) {
      return el.is(':checked');
    }
    // Multiple radio buttons
    else if (el.length > 1 && el.is('input[type=radio]')) {
      return el.filter(':checked').val();
    }
    // Textarea
    else if (el.is('textarea')) {
      return el.val();
    }
    // Select
    else if (el.is('select')) {
      // Multi-select
      if (el.find('option:selected').length > 1) {
        var val = _.map(el.find('option:selected'), function(option) {
          return $(option).val();
        });
      }
      else {
        var val = el.find('option:selected').val();
      }
      return val;
    }
    // Default input
    else {
      return el.val();
    }
  };

  // FormBinder.set
  // --------------

  // Simple form element setter
  FormBinder.set = function(el, value) {
    // Multiple checkboxes
    if (el.length > 1 && el.is('input[type=checkbox]')) {
      el.removeAttr('checked');
      _.each(value, function(val) {
        el.filter("[value=" + val + "]").attr('checked', 'checked');
      });
    }
    // Single checkbox
    else if (el.is('input[type=checkbox]')) {
      if (value == 1 || value == true || value == 'true') {
        el.attr('checked', 'checked');
      }
      else {
        el.removeAttr('checked');
      }
    }
    // Multiple radio buttons
    else if (el.length > 1 && el.is('input[type=radio]')) {
      el.removeAttr('checked');
      el.filter('[value=' + value + ']').attr('checked', 'checked');
    }
    // Textarea
    else if (el.is('textarea')) {
      el.val(value);
    }
    // Select
    else if (el.is('select')) {
      // Un-select all options
      el.find("option").removeAttr('selected');
      if (_.isArray(value) && el.attr('multiple') != '') {
        _.each(value, function(val) {
          el.find("option[value=" + val + "]").attr('selected', 'selected');
        });
      }
      else {
        el.find("option[value=" + value + "]").attr('selected', 'selected');
      }
    }
    // Default input
    else {
      el.val(value);
    }
  };
}).call(this);

