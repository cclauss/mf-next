<script type="text/javascript">
(function() {
    // load the css
    document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('geoadmin:static/build/closure.css'))}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('geoadmin:static/build/ol3.css'))}" + '" />');
    document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('geoadmin:static/build/ga.css'))}" + '" />');
    // load the javascript
    document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('geoadmin:static/lib/proj4js/proj4js-compressed.js'))}" + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('geoadmin:static/build/geoadmin.js'))}" + '"></scr' + 'ipt>');
})();
</script>
