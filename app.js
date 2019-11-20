const express = require("express");
const request = require('request');

var app = express();

const options = {
  host: 'http://localhost:64210',
  path: '/gephi/gs'
};

app.get("/nodes", (req, appRes, next) => {
    const nodeTypes = ['app', 'dataset', 'field', 'libItem', 'dashboard', 'chart', 'dimension', 'measure'];
    var nodes = [];
    request(options.host + options.path, { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        if (res.body) {
            var lines = res.body.split('\r\n');
            var obj = {};
            lines.forEach(e => {
                var node = {};
                try {
                    obj = JSON.parse(e);
                    if (obj.an) {
                        node.id = Object.keys(obj.an)[0];
                        Object.keys(obj.an[node.id]).forEach(k => {
                            node[k] = obj.an[node.id][k];
                        });
                        node.type = '';
                        if (node.label) {
                            var sl = node.label.split(':');
                            if (sl.length > 1 && nodeTypes.indexOf(sl[0]) > -1) {
                                node.type = sl[0];
                                node.label = sl[1];
                            }
                        }
                        nodes.push(node);
                    }
                } catch (err) {
                }
            });
            appRes.json(nodes);
        }
    });
});

app.get("/edges", (req, appRes, next) => {
    var edges = [];
    request(options.host + options.path, { json: false }, (err, res, body) => {
        if (err) { return console.log(err); }
        if (res.body) {
            var lines = res.body.split('\r\n');
            var obj = {};
            lines.forEach(e => {
                var edge = {};
                try {
                    obj = JSON.parse(e);
                    if (obj.ae) {
                        edge.id = Object.keys(obj.ae)[0];
                        Object.keys(obj.ae[edge.id]).forEach(k => {
                            edge[k] = obj.ae[edge.id][k];
                        });
                        edges.push(edge);
                    }
                } catch (err) {
                }
            });
            appRes.json(edges);
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});