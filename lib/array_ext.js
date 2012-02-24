(function() {

  Array.prototype.remove = function(element) {
    var index;
    index = this.indexOf(element);
    this.splice(index, 1);
    return element;
  };

}).call(this);
