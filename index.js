http		= require('httpsync') 
_couchdb  	= require('./lib/couch.js') ;
_math		= require('./lib/math.js').math;
_utils		= require('./lib/utils.js').utils;
jx = {} ;

jx.math 	= _math ;
jx.utils	= _utils;
jx.couchdb      = {};
jx.couchdb.instance= _couchdb.couchdb ;
module.exports = jx;

