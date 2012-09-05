(function() {
  "use strict";

  var modules,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  modules = Namespace("SEQ.modules");

  modules.Nav = (function() {

    function Nav(el) {
      this.el = el;
      this.toggle = __bind(this.toggle, this);

      this.close = __bind(this.close, this);

      this.open = __bind(this.open, this);

      this.detach = __bind(this.detach, this);

      this.attach = __bind(this.attach, this);

      this.init = __bind(this.init, this);

      this.menuBtn = document.createElement("div");
      this.menuInner = this.el.getElementsByTagName("ul")[0];
      this.init();
    }

    Nav.prototype.init = function() {
      return this.menuBtn.id = "menu-btn";
    };

    Nav.prototype.attach = function() {
      this.el.insertBefore(this.menuBtn, this.el.firstChild);
      this.menuBtn.addEventListener("click", this.toggle);
      return this.close();
    };

    Nav.prototype.detach = function() {
      return this.el.removeChild(this.menuBtn);
    };

    Nav.prototype.open = function() {
      this.closed = false;
      this.menuInner.className = "";
      return this.menuBtn.innerHTML = "CLOSE";
    };

    Nav.prototype.close = function() {
      this.closed = true;
      this.menuInner.className = "closed";
      return this.menuBtn.innerHTML = "MENU";
    };

    Nav.prototype.toggle = function() {
      if (this.closed) {
        return this.open();
      } else {
        return this.close();
      }
    };

    return Nav;

  })();

}).call(this);
