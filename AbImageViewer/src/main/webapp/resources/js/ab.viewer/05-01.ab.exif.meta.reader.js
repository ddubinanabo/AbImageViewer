var AbExifMetaReader = {
	read: function (meta){
		if (!meta)
			return null;
		
		var cnt = 0;
		for (var p in meta)
			if (meta.hasOwnProperty(p))
				cnt++;
		
		if (!cnt)
			return null;
		
		var gps = null;
		
		if (meta['GPSLatitude'] &&
			meta['GPSLongitude']){
			
			var gpsMeta = {
				versionID: meta['GPSVersionID'],
				
				latitudeRef: meta['GPSLatitudeRef'],
				latitude: meta['GPSLatitude'],
				longitudeRef: meta['GPSLongitudeRef'],
				longitude: meta['GPSLongitude'],
				
				altitudeRef: meta['GPSAltitudeRef'],
				altitude: meta['GPSAltitude'],
				
				//timeStamp: meta['GPSTimeStamp'],
				//dateStamp: meta['GPSDateStamp'],
			};
			
			var lat = this.dmsNumberArray(gpsMeta.latitude);
			var lng = this.dmsNumberArray(gpsMeta.longitude);
			var alt = this.gpsValue(gpsMeta.altitude);
			
			var gpsData = {
				latRef: gpsMeta.latitudeRef,
				lat: lat,
				lngRef: gpsMeta.longitudeRef,
				lng: lng,
				altRef: gpsMeta.altitudeRef,
				alt: alt,
			};
			
			var cnt = 0;
			for (var p in gpsData){
				if (data.hasOwnProperty(p) && gpsData[p]){
					if (gpsData[p])
						cnt++;
				}
			}
			
			if (cnt > 0)
				gps = gpsData;
		}
		
		var data = {
			make: meta['Make'],
			model: meta['Model'],
			software: meta['Software'],
			datetime: this.ymdhis(meta['DateTime']),
			
			orientation: this.value(meta['Orientation']),
			
			xresolution: this.value(meta['XResolution']),
			yresolution: this.value(meta['YResolution']),
			resolutionUnit: this.value(meta['ResolutionUnit']),
			
			xdimension: this.value(meta['PixelXDimension']),
			ydimension: this.value(meta['PixelYDimension']),
			
			gps: gps
		};
		
		var cnt = 0;
		for (var p in data){
			if (data.hasOwnProperty(p)){
				if (data[p])
					cnt++;
			}
		}
		
		if (cnt > 0)
			return data;
		
		return null;
	},
	
	ymdhis: function (value){
		if (value) return value.replace(/[\-\s:]/g, '');
		return value;
	},
	
	gpsText: function (value){
		if (!value || !$.isArray(value))
			return 0;
		
		var d = this.gpsValue(value[0]); // 도
		var m = this.gpsValue(value[1]); // 분
		var s = this.gpsValue(value[2]); // 초
		
		return d + '° ' + m + '\' ' + s + '"';
	},
	
	dmsNumberArray: function (dms){
		return [ this.gpsValue(dms[0]), this.gpsValue(dms[1]), this.gpsValue(dms[2]) ];
	},
	
	dms2degree: function (value){
		if (!value || !$.isArray(value))
			return 0;
		
		var d = this.gpsValue(value[0]); // 도
		var m = this.gpsValue(value[1]); // 분
		var s = this.gpsValue(value[2]); // 초
		
		return d + (m / 60) + (s / 3600);
	},
	
	toInt: function (value){
		var a = value * 100000;
		var b = Math.round(a);
		var c = b / 100000;
		
		return c;
	},
	
	degree2dms: function (value){
		var d = parseInt(value);
		var mo = (value - d) * 60;
		var m = parseInt(mo);
		var s = (mo - m) * 60;
		
		return [d, this.toInt(m), this.toInt(s)];
	},
	
	gpsValue: function(value){
		if (typeof value === 'undefined' || value == null)
			return 0;
		
		if (AbCommon.isString(value)){
			var a = value.split('/');
			
			if (a.length > 1)
				value = parseFloat(a[0]) / parseFloat(a[1]);
			else
				value = parseFloat(a[0]);
		}else if (value instanceof Number)
			value = parseFloat(value);
		
		return value;
	},
	
	value: function(value){
		if (value instanceof Number)
			value = parseFloat(value);
		
		return value;
	},
	
};

/* orientation 참고
 
// load-image-orientation.js
switch (orientation) {
  case 2:
    // horizontal flip
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    break
  case 3:
    // 180° rotate left
    ctx.translate(width, height)
    ctx.rotate(Math.PI)
    break
  case 4:
    // vertical flip
    ctx.translate(0, height)
    ctx.scale(1, -1)
    break
  case 5:
    // vertical flip + 90 rotate right
    ctx.rotate(0.5 * Math.PI)
    ctx.scale(1, -1)
    break
  case 6:
    // 90° rotate right
    ctx.rotate(0.5 * Math.PI)
    ctx.translate(0, -height)
    break
  case 7:
    // horizontal flip + 90 rotate right
    ctx.rotate(0.5 * Math.PI)
    ctx.translate(width, -height)
    ctx.scale(-1, 1)
    break
  case 8:
    // 90° rotate left
    ctx.rotate(-0.5 * Math.PI)
    ctx.translate(-width, 0)
    break
}

*/