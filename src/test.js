const validateJWT = require('./validateJWT');

event = { headers: { Authorization: 'Bearer xxx' } } ;

const sub = validateJWT.getSub( event.headers.Authorization.slice(7) ) ;

console.log(sub) ;