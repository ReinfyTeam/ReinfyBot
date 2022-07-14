exports.run = (client, message, args) => {
message.channel.send(`🏓 My Latency is ${Math.round(client.ws.ping)}ms`);
}

exports.name = "ping";