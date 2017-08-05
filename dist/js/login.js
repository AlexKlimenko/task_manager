;(function ($) {
    class Login {

        constructor() {
            this._form = form;

            this._valid = true;
            
            this._inputs = $('input[required]');
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: '',
                password: ''
            
            };
        }

        init() {
            let self = this;
            this.event(self);
        }
        validate(e, self) {
            let dataRegex = this.dataset.regex;
            let reg = new RegExp(dataRegex);

            if(!reg.test(this.value) && this.value || !reg.test(this.value) && e.type === 'submit'){
                this.classList.add('has-error');
                self._valid = false;
            } else {
                this.classList.remove('has-error');
            }
        }
        event(self) {
            this._inputs.on('change', function(e) {

                self.validate.call(this, e, self);
                
                self._sendingObj[this.name] = this.value;
                console.log(self._sendingObj);
            })
            this._form.on('submit', function(e) {
                e.preventDefault();

                self._valid = true;

                self._inputs.each(function(i, input){
                     self.validate.call(input, e, self)
                });

               if( !self._valid ) return
               self.sendRequest(self);
            })
        }

        setTocken(id, save) {
            let date = new Date();
            date.setSeconds(date.getSeconds() + 60000);

            document.cookie = save ? `_id=${id};expires=${date.toUTCString()}` : `_id=${id};`;
            window.location = '/task';
        }

        sendRequest(self) {
            $.ajax({
                method: 'POST',
                data: JSON.stringify(this._sendingObj),
                contentType: 'application/JSON',
                url: 'http://localhost:8080/login',
                success: function(res) {
                    console.log(self);
                    self.setTocken(res._id, self._save_checkbox.prop('checked'));
                },
                error: function(err) {
                    console.log(err);
                },
            })
        }
    

    }

    let form = $('form[name="loginForm"]');
    let newLogin = new Login(form);
    newLogin.init();
    
})(jQuery);