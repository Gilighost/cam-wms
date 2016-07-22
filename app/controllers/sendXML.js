module.exports = function(res, xml){
  res.set('Content-Type', 'text/xml');
  res.send(xml);
}
