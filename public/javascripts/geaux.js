var geaux = {};
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
