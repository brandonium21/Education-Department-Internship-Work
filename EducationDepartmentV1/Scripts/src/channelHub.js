/*! Rappid v1.7.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2016-03-03 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


// This is an example setup of the server-side of the Channel synchronization plugin.
// It demostrates how to configure the ChannelHub in order to implement room-separated graph
// synchronization.

// USAGE:

// Run: node channelHub
// Run With REPL: node channelHub --repl
// Type help in the REPL to bring up a help instructions.

var joint = require('../../index');
var Channel = joint.com.Channel;
var ChannelHub = joint.com.ChannelHub;

var PORT = 4141;

var channels = {};
var channelHub = new ChannelHub({ port: PORT });
channelHub.route(function(req) {
    var query = JSON.parse(req.query.query);
    if (channels[query.room]) return channels[query.room];
    return channels[query.room] = new Channel({
        graph: new joint.dia.Graph,
        ttl: 60, // Together with the healthCheckInterval, this considers a site dead if its socket was disconnected more than 1 hour.
        healthCheckInterval: 1000 * 60 * 60, // 1m
        debugLevel: 0,
        reconnectInterval: 10000 // 10s
    });
});

console.log('ChannelHub running on port ' + PORT);

if (process.argv.indexOf('--repl') !== -1) {
    startRepl();
}

function startRepl() {

    var repl = require('repl');
    var cli = repl.start({ prompt: 'Channel > ' });
    cli.context.joint = joint;
    cli.context.channels = channels;
    cli.context.help = [
        'Type channels [enter] to see the server side channels for each room.',
        'channels.A.options.graph.addCell(new joint.shapes.basic.Rect({ position: { x: 50, y: 50 }, size: { width: 100, height: 70 } }))',
        'channels.B.options.graph.get("cells").at(0).translate(300, 100, { transition: { duration: 2000 } })'
    ];

    cli.on('exit', function () {
        console.log('Bye.');
        channelHub.close();
        process.exit();
    });
}
