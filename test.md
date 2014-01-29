Name         | Default         | Description
-------------|-----------------|-----------------------------------------------
contents     | `./contents`    | contents directory location
templates    | `./templates`   | templates directory location
views        | `null`          | views directory location, optional
locals       | `{}`            | global site variables, can also be a path to a json file
require      | `{}`            | modules to load and add to locals. e.g. if you want underscore as `_` you would say `{"_": "underscore"}`
plugins      | `[]`            | list of plugins to load
ignore       | `[]`            | list of files or pattern to ignore
output       | `./build`       | output directory, this is where the generated site is output when building
baseUrl      | `/`             | base url that site lives on, e.g. `/blog/`.
hostname     | `null`          | hostname to bind preview server to
