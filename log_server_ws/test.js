var assert = require("assert");
var files = require("./files");

describe('t1', function() {
  describe('t2', function() {
    it('should', function() {
      var f = files.createWatchCallback("aaaa");
      assert.equal("function", typeof f);
      var g = files.createWatchCallback("bbbb");
      assert.equal("function", typeof f);
    });
  });
});
