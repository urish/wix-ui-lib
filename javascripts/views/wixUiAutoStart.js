var wixUiAutoStart = (function (){

    function init() {
		var elements = $('[data-wix-controller], [wix-controller]');
       for (var i = 0; i < elements.length; i++) {
           initializePlugin(elements[i]);
       }
    }

	function getAttribute(element, attr){
		var val = element.getAttribute(attr);
		if(!val){ 
			val = element.getAttribute('data-'+attr);
		}
		return val;
	}
	
    function initializePlugin(element) {
        var ctrl = getAttribute(element, 'wix-controller');
		var ctrlName = getCtrlName(ctrl);
		var options = getOptions(element, ctrl);
		applyPlugin(element, ctrlName, options);        
    }
	
	function applyPlugin(element, pluginName, options) {
		var pluginName = fixPluginName(pluginName);
		if($.fn[pluginName]){
			$(element)[pluginName](options);
		}else{
			console.error('Plugin ' + pluginName + ' is not exsist');
		}
	}
	
	function evalOptions(options){
		 try{
			return (new Function('return '+ options + ';'))()
		 }catch(e){
			throw new Error('Options for plugin is not valid: ' + options);
		 }
	}
	
	function fixPluginName(pluginName){
		return pluginName;
	}
	
	function getOptions(element, ctrl){
		var options = getOptionsFormCtrl(ctrl);
		if (!options) {
			options = getAttribute(element, 'wix-options');
		}			
		return evalOptions(options) || {};
	}
	
    function getOptionsFormCtrl(ctrl) {
		var index = ctrl.indexOf(':');
        if (index !== -1) {
            return ctrl.substr(index + 1);
        }
		return false;
    }

    function getCtrlName(ctrl) {
		var index = ctrl.indexOf(':');
        if (index !== -1) {
            return ctrl.substr(0, index);
        }
		return ctrl;
    }

	return init;

})();
