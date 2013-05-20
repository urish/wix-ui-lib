$(function() {

    function init() {
       var elements = $('[data-wix-controller]');

       for (var i = 0; i < elements.length; i++) {
           _initializePlugin(elements[i]);
       }
    }

    function _initializePlugin(element) {
        var options = {};
        var pluginName = '';
        var ctrlName = element.getAttribute('data-wix-controller');

        if (ctrlName) {
            options = getOptionFromControllerDef(ctrlName);
            if(!options){
                try{
                    options = JSON.parse(element.getAttribute('data-wix-options'));
                } catch (e) {}
            }

            $(element)[_fixPluginName(ctrlName)](options);
        }
    }

    function getOptionFromControllerDef(ctrlName) {
        var options;

        if (ctrlName.indexOf(':') != -1) {
            options = ctrlName.substr(ctrlName.indexOf(':') + 1);
        }
        else
        {
            options = ctrlName.substr(0, ctrlName.indexOf(':'));
        }

        return JSON.parse(options);
    }

    function _fixPluginName(ctrlName) {
        var name = ctrlName;

        if (ctrlName.indexOf(':') != -1) {
            name = ctrlName.substr(0, ctrlName.indexOf(':'));
        }

        return name;
    }

    init();
});