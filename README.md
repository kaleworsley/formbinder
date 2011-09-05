# FormBinder

FormBinder is a simple javascript library that binds form element change events
to corresponding Backbone.js model attributes.

## Example

### Model

    Project = Backbone.Model.extend({});
    project = new Project({
      name: 'Test Project',
      description: 'This is a description of test project.'
    })

### Template

    <form>
        <div>
          <label for="name">Name:</label>
          <input id="name" data-field-name="name" name="name" type="text" />
        </div>
        <div>
          <label for="description">Description:</label>
          <textarea id="description" data-field-name="description" name="description"></textarea>
        </div>
        <input id="submit" type="submit" value="Save!" />
        <input id="clear" type="submit" value="Clear!" />
    </form>

### View

    ProjectForm = Backbone.View.extend({
      render: function() {
        $(this.el).html(template); // ^^^
        FormBinder.bind(this);
        return this;
      },
      events: {
        'click #submit': 'save',
        'click #clear': 'clear'
      },
      save: function() {
        // Save code goes here
        // this.model.set(this.changed_attributes);
        // this.model.save();
        return false;
      },
      clear: function() {
        // Revert form to original model attributes
        FormBinder.clear(this);
        return false;
      }
    });
    project_form = new ProjectForm({model: project});


Note the `data-field-name` attribute. This contains the name of the model attribute that you would like to bind to. This can be changed by adding `FormBinder.options.attribute = 'name';` to the beginning of your code.

If it is a new model the fields are left blank otherwise `name` and `description` will be filled with the existing model attributes when you call render.

For a more detailed example see example.html.

## Testing

Tests are written with quint. See tests.html.


It is currently being tested to work with text inputs, textareas, single checkboxes, multiple checkboxes, radio buttons, single select lists and multiple select lists.


## Requirements

- [jQuery](http://jquery.com/)
- [Underscore.js](http://documentcloud.github.com/underscore/)
- [Backbone.js](http://documentcloud.github.com/backbone/)


## License
Copyright (C) 2011 Kale Worsley kale@egressive.com

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.

