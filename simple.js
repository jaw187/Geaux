
PingManager = require( './node-ping' ).PingManager;
var ping_manager = new PingManager();

ping_manager.start( function()
{
  var self = this;

  var short_pinger = self.createOnePinger( 1000, ['core1.tdc.nwt.dellservices.net','localhost' ] );
  short_pinger.on( 'ping', function( mo )
  {
    console.log(mo);
  });

  short_pinger.start();
});

ping_manager.start( function()
{
  var self = this;

  var short_pinger = self.createOnePinger( 1000, 'google.com' );
  short_pinger.on( 'ping', function( mo )
  {
    console.log(mo);
  });

  short_pinger.start();
});

