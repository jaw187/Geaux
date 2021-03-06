Array.prototype.last100 = function () {
  if (this.length < 100) return this;

  var last100 = [];
  var start = this.length-101;

  for (var i = 0; i < 100; i++)
    last100.push(this[i + start]);

  return last100;
}

Array.prototype.greatest = function () {
  var max=+this[0];
  for (var i=1;i<this.length;i++) 
    if (this[i] > max) max=+this[i];

  return max;
}

Array.prototype.stdDeviation = function () {
  var mean = this.avg();
  var difsum = 0;
  var responses=0;

  for (var i = 0; i < this.length; i++) {
    if (+this[i] !== 0) {
      difsum = Math.pow(+this[i] - mean,2);
      responses++;
    }
  }

  return Math.sqrt(difsum/responses);

}

Array.prototype.min = function () {
  var min = +this[0]
  for (var i = 1; i < this.length; i++)
    if (min > this[i]) min = +this[i];

  return min;
}

Array.prototype.avg = function () {
  var sum=0;
  var drops=this.drops();

  for (var i = 0; i < this.length; i++)
    if (+this[i] !== 0)
      sum += +this[i];

  return (sum/(this.length-drops));
}

Array.prototype.drops = function () {
  var drops=0;
  for (var i = 0; i < this.length; i++)
    if (+this[i] === 0)
      drops++;

  return drops;
}

function GeauxGraphs() {
  var height = 200;
  var width = 400;
  var margin = 20;

  var graphs = {
    lifetime: false,
    last100: false
  }

  this.stats = {
    stdDeviation: 0,
    min: 0,
    max: 0,
    avg: 0,
    sent: 0,
    drops: 0
  }

  this.draw = function () {
    if (rtts.length > 100) {
      if (graphs.last100 === false) {
        graphs.last100 = new GeauxGraph("last100",height,width,margin);
        graphs.last100.draw(rtts.last100());
      }
      else
        graphs.last100.update(rtts.last100());
    }

    if (graphs.lifetime === false) {
      graphs.lifetime = new GeauxGraph("lifetime",height,width,margin);
      graphs.lifetime.draw(rtts);
    }
    else
      graphs.lifetime.update(rtts);

    updatePingStats();


  }

  function updatePingStats() {
    stdv=rtts.stdDeviation();
    min=rtts.min();
    max=rtts.greatest();
    avg=rtts.avg();
    sent=rtts.length;
    drops=rtts.drops();

    $('#sent').html(sent);
    $('#min').html(min);
    $('#avg').html(avg.toFixed());

    $('#drops').html(drops);
    if ((drops/sent) > .01) {
      $('#drops').attr('class','label label-important');
    }
    else if (drops > 0) {
      $('#drops').attr('class','label label-warning');
    }
    else $('#drops').attr('class','label label-success');

    $('#max').html(max);
    if (max > min*10)  $('#max').addClass('label-warning');
    else $('#max').attr('class','label');

    $('#stdv').html(stdv.toFixed(3));
    if (stdv > 2 && stdv <= 5) $('#stdv').attr('class','label label-warning');
    else if (stdv > 5) $('#stdv').attr('class', 'label label-important');
    else $('#stdv').attr('class','label label-success');

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

   var line = d3.svg.line()
               .x(function(d,i) { return self.x(i); })
               .y(function (d) { return -1 * self.y(d); });

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

    self.x = d3.scale.linear().domain([0,data.length]).range([0+m,w-m]);
    self.y = d3.scale.log().domain([.1,data.greatest()]).range([0+m,h-m]).nice();

    d3.select("#path" + id)
             .attr('d', line(data))
             .transition(1)
             .ease();

    self.g.selectAll(".xLabel").remove();
    self.g.selectAll(".xTicks").remove();
    self.g.selectAll(".yLabel").remove();
    self.g.selectAll(".yTicks").remove();

    Ticks();
  }

  this.draw = function (data) {
    self.clear();
    self.x = d3.scale.linear().domain([0,data.length]).range([0+m,w-m]);
    self.y = d3.scale.linear().domain([0,data.greatest()]).range([0+m,h-m]);

    self.vis = d3.select("div#" + id)
               .insert("svg:svg")
               .attr("width",w)
               .attr("height",h);

    self.g = self.vis.append("svg:g")
             .attr("transform","translate(0,200)");

    self.g.append("svg:path")
          .attr("d", line(data))
          .attr("id", "path" + id);

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
