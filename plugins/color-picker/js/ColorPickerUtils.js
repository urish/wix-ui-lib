var hslGrad = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PiA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIgdmVyc2lvbj0iMS4wIiB3aWR0aD0iMTAwJSIgICAgIGhlaWdodD0iMTAwJSIgICAgICAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPiAjRkYwMDAwLCAjRkZGRjAwLCAjMDBGRjAwLCAjMDBGRkZGLCAjMDAwMEZGLCAjRkYwMEZGLCAjRkYwMDAwICAgPGRlZnM+ICAgICA8bGluZWFyR3JhZGllbnQgaWQ9Im15TGluZWFyR3JhZGllbnQxIiAgICAgICAgICAgICAgICAgICAgIHgxPSIwJSIgeTE9IjAlIiAgICAgICAgICAgICAgICAgICAgIHgyPSIwJSIgeTI9IjEwMCUiICAgICAgICAgICAgICAgICAgICAgc3ByZWFkTWV0aG9kPSJwYWQiPiAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiAgIHN0b3AtY29sb3I9IiNGRjAwMDAiIHN0b3Atb3BhY2l0eT0iMSIvPiAgICAgICA8c3RvcCBvZmZzZXQ9IjIwJSIgICBzdG9wLWNvbG9yPSIjRkZGRjAwIiBzdG9wLW9wYWNpdHk9IjEiLz4gICAgICAgPHN0b3Agb2Zmc2V0PSI0MCUiICAgc3RvcC1jb2xvcj0iIzAwRkYwMCIgc3RvcC1vcGFjaXR5PSIxIi8+ICAgICAgIDxzdG9wIG9mZnNldD0iNjAlIiAgIHN0b3AtY29sb3I9IiMwMDAwRkYiIHN0b3Atb3BhY2l0eT0iMSIvPiAgICAgICA8c3RvcCBvZmZzZXQ9IjgwJSIgc3RvcC1jb2xvcj0iI0ZGMDBGRiIgc3RvcC1vcGFjaXR5PSIxIi8+ICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGMDAwMCIgc3RvcC1vcGFjaXR5PSIxIi8+ICAgICA8L2xpbmVhckdyYWRpZW50PiAgIDwvZGVmcz4gICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgICAgICBzdHlsZT0iZmlsbDp1cmwoI215TGluZWFyR3JhZGllbnQxKTsiIC8+IDwvc3ZnPg==';

var ieG = (function (dir, stops) {
	var grd = {
		open : '<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.0" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>',
		close : '</linearGradient></defs><rect width="100%" height="100%" style="fill:url(#g);" /></svg>',
		dirs : {
			left : 'x1="0%" y1="0%" x2="100%" y2="0%"',
			right : 'x1="100%" y1="0%" x2="0%" y2="0%"',
			top : 'x1="0%" y1="0%" x2="0%" y2="100%"',
			bottom : 'x1="0%" y1="100%" x2="0%" y2="0%"'
		}
	};
	return function (dir, stops) {
		var r = '<linearGradient id="g" ' + grd.dirs[dir] + ' spreadMethod="pad">';
		stops.forEach(function (stop) {
			r += '<stop offset="' + stop.offset + '" stop-color="' + stop.color + '" stop-opacity="' + stop.opacity + '"/>';
		});
		r = 'data:image/svg+xml;base64,' + btoa(grd.open + r + grd.close);
		return r;
	};
})();

var photoshopG1 = ieG('bottom', [
    {
        offset : '0%',
        color : 'black',
        opacity : '1'
    },
    {
        offset : '100%',
        color : 'black',
        opacity : '0'
    }
]);

//    normalG2 = ieG('top', [{
//        offset : '0%',
//        color : 'black',
//        opacity : '1'
//    }, {
//        offset : '100%',
//        color : 'white',
//        opacity : '1'
//    }
//    ]);

//////////////////////////////////////////////////////////////////////
/////////////////////// color convetion tolls ////////////////////////
//////////////////////////////////////////////////////////////////////

//function rgbToHex(r, g, b) {
//	r = parseInt(r);
//	g = parseInt(g);
//	b = parseInt(b);
//
//	return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
//}

//function hexToRgb(hex) {
//	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//	return result ? {
//		r : parseInt(result[1], 16),
//		g : parseInt(result[2], 16),
//		b : parseInt(result[3], 16)
//	}
//	: null;
//}

//function rgbToHsl(r, g, b) {
//	r /= 255,
//	g /= 255,
//	b /= 255;
//
//	var max = Math.max(r, g, b),
//	min = Math.min(r, g, b);
//	var h,
//	s,
//	l = (max + min) / 2;
//
//	if (max == min) {
//		h = s = 0; // achromatic
//	} else {
//		var d = max - min;
//		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//		switch (max) {
//		case r:
//			h = (g - b) / d + (g < b ? 6 : 0);
//			break;
//		case g:
//			h = (b - r) / d + 2;
//			break;
//		case b:
//			h = (r - g) / d + 4;
//			break;
//		}
//		h /= 6;
//	}
//
//	return [h, s, l];
//}

//function hue2rgb(p, q, t) {
//	if (t < 0)
//		t += 1;
//	if (t > 1)
//		t -= 1;
//	if (t < 1 / 6)
//		return p + (q - p) * 6 * t;
//	if (t < 1 / 2)
//		return q;
//	if (t < 2 / 3)
//		return p + (q - p) * (2 / 3 - t) * 6;
//	return p;
//}

//function hslToRgb(hue, sat, val) {
//	var red,
//	grn,
//	blu,
//	i,
//	f,
//	p,
//	q,
//	t;
//	hue %= 360;
//	if (val === 0) {
//		return ({
//			r : 0,
//			g : 0,
//			b : 0
//		});
//	}
//	sat /= 100;
//	val /= 100;
//	hue /= 60;
//	i = Math.floor(hue);
//	f = hue - i;
//	p = val * (1 - sat);
//	q = val * (1 - (sat * f));
//	t = val * (1 - (sat * (1 - f)));
//	if (i === 0) {
//		red = val;
//		grn = t;
//		blu = p;
//	} else if (i == 1) {
//		red = q;
//		grn = val;
//		blu = p;
//	} else if (i == 2) {
//		red = p;
//		grn = val;
//		blu = t;
//	} else if (i == 3) {
//		red = p;
//		grn = q;
//		blu = val;
//	} else if (i == 4) {
//		red = t;
//		grn = p;
//		blu = val;
//	} else if (i == 5) {
//		red = val;
//		grn = p;
//		blu = q;
//	}
//	red = Math.floor(red * 255);
//	grn = Math.floor(grn * 255);
//	blu = Math.floor(blu * 255);
//	return ({
//		r : red,
//		g : grn,
//		b : blu
//	});
//}

//function rgbToHsv(r, g, b) {
//	r = r / 255,
//	g = g / 255,
//	b = b / 255;
//	var max = Math.max(r, g, b),
//	min = Math.min(r, g, b);
//	var h,
//	s,
//	v = max;
//
//	var d = max - min;
//	s = max === 0 ? 0 : d / max;
//
//	if (max == min) {
//		h = 0; // achromatic
//	} else {
//		switch (max) {
//		case r:
//			h = (g - b) / d + (g < b ? 6 : 0);
//			break;
//		case g:
//			h = (b - r) / d + 2;
//			break;
//		case b:
//			h = (r - g) / d + 4;
//			break;
//		}
//		h /= 6;
//	}
//
//	return [h, s, v];
//}

function hsvToRgb(h, s, v) {
	var r,
	g,
	b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {
	case 0:
		r = v,
		g = t,
		b = p;
		break;
	case 1:
		r = q,
		g = v,
		b = p;
		break;
	case 2:
		r = p,
		g = v,
		b = t;
		break;
	case 3:
		r = p,
		g = q,
		b = v;
		break;
	case 4:
		r = t,
		g = p,
		b = v;
		break;
	case 5:
		r = v,
		g = p,
		b = q;
		break;
	}

	return [r * 255, g * 255, b * 255];
}
