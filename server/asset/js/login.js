'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    var Login = function () {
        function Login() {
            _classCallCheck(this, Login);

            this._form = form;

            this._valid = true;

            this._inputs = $('input[required]');
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: '',
                password: ''

            };
        }

        _createClass(Login, [{
            key: 'init',
            value: function init() {
                var self = this;
                this.event(self);
            }
        }, {
            key: 'validate',
            value: function validate(e, self) {
                var dataRegex = this.dataset.regex;
                var reg = new RegExp(dataRegex);

                if (!reg.test(this.value) && this.value || !reg.test(this.value) && e.type === 'submit') {
                    this.classList.add('has-error');
                    self._valid = false;
                } else {
                    this.classList.remove('has-error');
                }
            }
        }, {
            key: 'event',
            value: function event(self) {
                this._inputs.on('change', function (e) {

                    self.validate.call(this, e, self);

                    self._sendingObj[this.name] = this.value;
                    console.log(self._sendingObj);
                });
                this._form.on('submit', function (e) {
                    e.preventDefault();

                    self._valid = true;

                    self._inputs.each(function (i, input) {
                        self.validate.call(input, e, self);
                    });

                    if (!self._valid) return;
                    self.sendRequest(self);
                });
            }
        }, {
            key: 'setTocken',
            value: function setTocken(id, save) {
                var date = new Date();
                date.setSeconds(date.getSeconds() + 60000);

                document.cookie = save ? '_id=' + id + ';expires=' + date.toUTCString() : '_id=' + id + ';';
                window.location = '/task';
            }
        }, {
            key: 'sendRequest',
            value: function sendRequest(self) {
                $.ajax({
                    method: 'POST',
                    data: JSON.stringify(this._sendingObj),
                    contentType: 'application/JSON',
                    url: 'http://localhost:8080/login',
                    success: function success(res) {
                        console.log(self);
                        self.setTocken(res._id, self._save_checkbox.prop('checked'));
                    },
                    error: function error(err) {
                        console.log(err);
                    }
                });
            }
        }]);

        return Login;
    }();

    var form = $('form[name="loginForm"]');
    var newLogin = new Login(form);
    newLogin.init();
})(jQuery);