<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
</head>
<% 
    _ = TranslationStringFactory('geoadmin')
    ts = _('ch.bafu.bundesinventare-jagdbanngebiete')
    from pyramid.i18n import get_localizer
    localizer = get_localizer(request)
    translated = localizer.translate(ts)
%>
<body>
    <p>lool</p>
    <p>${translated}</p>
</body>
</html>
