geaux['traces'] = [];
geaux['hops'] = [];
geaux['tracetable'] = false;
geaux['graph'] = false;

var socket = io.connect('http://ten.tech.tenseven.org:10700');

socket.on('trace', function (data) {
  geaux.traces.push(data);
  if (geaux['tracetable']  === false) geaux['tracetable']  = new Tracetable();
  if (geaux['graph'] === false) geaux['graph'] = new GeauxGraphs();
  
  if (data.length) {
    for (var i = 0; i < data.length; i++) {
      if (geaux.hops.length === i) geaux.hops[i] = [];

      if (i > 0) {
        if (geaux.hops[i].length < geaux.hops[i-1].length - 1) {
          for (var j = geaux.hops[i].length; j < geaux.hops[i-1].length - 1; j++) 
            geaux.hops[i].push(0.1);
        }
      }

      if (data[i] === false) geaux.hops[i].push(0.1);

      else {
        for (var host in data[i]) {
          for (var j = 0; j < data[i][host].length; j++) {
            geaux.hops[i].push(data[i][host][j]);
          }
        }
      }
    }
  }

  geaux.tracetable.update(data, geaux.graph.update);
});
  
socket.emit('init',{ which: 'trace', interval: 1000, host: geaux.host});

function GeauxGraphs() {
  var height = 200;
  var width = 400;
  var margin = 20;

  var graphs = {
    tracegraph : false,
  }

  var self = this;

  this.update = function() {
    if (graphs.tracegraph === false) {
      graphs.tracegraph = new GeauxGraph("tracegraph",height,width,margin);
      graphs.tracegraph.draw(geaux.hops);
    }
    else
      graphs.tracegraph.update(geaux.hops);
  }
}

function GeauxGraph(id,h,w,m) {
  var self = this;

  this.g = false;
  this.vis = false;

  this.clear = function () {
    if (self.vis) self.vis.remove();
    if (self.g) self.g.remove();

    d3.select("div#" + id).html('');
  }

  function newLine(rtts,which) {
    var line = d3.svg.line()
             .x(function(d,i) { return self.x(i); })
             .y(function (d) { return -1 * self.y(d); });

    self.g.append("svg:path")
      .attr("d", line(rtts))
      .attr("id","path" + id + which)
      .attr("class","hop" + which);

    return line;
  }

  var lines = []

  function Ticks() {
    self.g.selectAll(".xLabel")
      .data(self.x.ticks(5))
      .enter().append("svg:text")
      .attr("class", "xLabel")
      .text(String)
      .attr("x", function(d) { return self.x(d) })
      .attr("y", 0)
      .attr("text-anchor", "middle");

    var yTicks = (function () {
          var tempticks = self.y.ticks();
          var returnticks = [];
          var i = 0;
          while (tempticks[i] < 1) {
            i++;
          }
          if (i > 0) tempticks.splice(0,i);

          for (i = 0; i < tempticks.length; i = i + Math.floor(tempticks.length/4)) {
            returnticks.push(tempticks[i]);
          }
          return returnticks;
        })()
    self.g.selectAll(".yLabel")
      .data(yTicks)
      .enter().append("svg:text")
      .attr("class", "yLabel")
      .text(String)
      .attr("x", 0)
      .attr("y", function(d) { return -1 * self.y(d) })
      .attr("text-anchor", "right")
      .attr("dy", 4);

    self.g.selectAll(".xTicks")
      .data(self.x.ticks(5))
      .enter().append("svg:line")
      .attr("class", "xTicks")
      .attr("x1", function(d) { return self.x(d); })
      .attr("y1", -1 * self.y(0))
      .attr("x2", function(d) { return self.x(d); })
      .attr("y2", -1 * self.y(-0.3));

    self.g.selectAll(".yTicks")
      .data(yTicks)
      .enter().append("svg:line")
      .attr("class", "yTicks")
      .attr("y1", function(d) { return -1 * self.y(d); })
      .attr("x1", self.x(-0.3))
      .attr("y2", function(d) { return -1 * self.y(d); })
      .attr("x2", self.x(0));
  }
  this.update = function(data) {

    var xLength = 0,
        yMax = 0;

    for (var i = 0; i < data.length; i++) {
      if (data[i].length && data[i].greatest) {
        if (xLength < data[i].length)
          xLength = data[i].length
        if (yMax < data[i].greatest())
          yMax = data[i].greatest();
      }
    }
    self.x = d3.scale.linear().domain([0,xLength]).range([0+m,w-m]);
    self.y = d3.scale.log().domain([.1,yMax]).range([0+m,h-m]).nice();

    console.log(self.x(xLength - 1));

    for (var i = 0; i < data.length; i++) {
      if (lines.length === i) lines[i]=newLine(data[i],i);
      d3.select("#path" + id + i)
        .attr('d',lines[i](data[i]))
        .transition(1)
        .ease();
    }


    self.g.selectAll(".xLabel").remove();
    self.g.selectAll(".xTicks").remove();
    self.g.selectAll(".yLabel").remove();
    self.g.selectAll(".yTicks").remove();

    Ticks();
  }
  this.draw = function (data) {
    self.clear();

    var xLength = data[0].length;
    var yMax = data[0].greatest();

    for (var i = 1; i < data.length; i++) {
      if (xLength < data[i].length)
        xLength = data[i].length;
      if (yMax < data[i].greatest())
        yMax = data[i].greatest();
    }

    self.x = d3.scale.linear().domain([0,xLength]).range([0+m,w-m]);
    self.y = d3.scale.linear().domain([0,yMax]).range([0+m,h-m]);

    self.vis = d3.select("div#" + id)
               .insert("svg:svg")
               .attr("width",w)
               .attr("height",h);

    self.g = self.vis.append("svg:g")
             .attr("transform","translate(0,200)");

    self.g.append("svg:line")
          .attr("x1",self.x(0))
          .attr("y1",-1 * self.y(0))
          .attr("x2", w-m)
          .attr("y2", -1 * self.y(0));

    self.g.append("svg:line")
      .attr("x1", self.x(0))
      .attr("y1", -1 * self.y(0))
      .attr("x2", self.x(0))
      .attr("y2", -1 * (h-m))

    Ticks();
  }
}


function Tracetable() {
  this.table = $('#trace');
  this.tbody = $('#tracebody');
  this.trace = [];

  var self = this;

  this.update = function (trace, cb) {
    for (var i = 0; i < trace.length; i++) {
      if (!self.trace[i])
        self.trace[i]={};
      if (trace[i] === false) {
        if (!self.trace[i]['Unresponsive'])
          self.trace[i]['Unresponsive'] = [];

        self.trace[i]['Unresponsive'].push(0);
      }
      else {
        for (var host in trace[i]) {
          if (trace[i].hasOwnProperty(host)) {
            if (!self.trace[i][host])
              self.trace[i][host] = [];

            for (var k = 0; k < trace[i][host].length; k++)
              self.trace[i][host].push(trace[i][host][k]);
          }
        }
      }
    }
    this.drawtable();
    cb();
  }
  this.drawtable = function () {
    $('.tracerow').remove();

    var firsthop;
    for (var i = 0; i < self.trace.length; i++) {
      firsthop=true;
      for (var host in self.trace[i]) {
        if (self.trace[i].hasOwnProperty(host)) {
          self.tbody.append(tracetablehop(host,self.trace[i][host],i,firsthop));
          firsthop=false;
        }
      }
    }
  }
}

function tracetd(content) {
  var td = document.createElement('td');
  $(td).html(content);

  return td;
}

function tracetablehop(host,rtts,hop,first) {
  var row = document.createElement('tr');
  $(row).addClass('tracerow');

  if (first) 
    $(row).append(tracetd(hop));
  else
    $(row).append(document.createElement('td'));

  $(row).append(tracetd(host));

  $(row).append(tracetd(rtts.length));

  $(row).append(tracetd(rtts.drops()));

  $(row).append(tracetd(rtts[rtts.length-1]));

  $(row).append(tracetd(rtts.avg().toFixed(3)));

  $(row).append(tracetd(rtts.greatest()));

  $(row).append(tracetd(rtts.stdDeviation().toFixed(3)));
  return row;
}
