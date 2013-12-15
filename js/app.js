///////////////////////////////////////

var Controller = Backbone.Router.extend({
    routes: {
        "": "start", // Пустой hash-тэг
        "!/": "start", // Начальная страница
        "!/success": "success", // Блок удачи
        "!/error": "error" // Блок ошибки
    },

    start: function () {
        appState.set({ state: "start" });
    },

    success: function () {
        appState.set({ state: "success" });
    },

    error: function () {
        appState.set({ state: "error" });
    }
});

///////////////////////////////////////

 

 var Block = Backbone.View.extend({

    templates: { // Шаблоны на разное состояние
        "start": _.template($('#start').html()),
        "success": _.template($('#success').html()),
        "error": _.template($('#error').html())
    },

	initialize: function () { // Подписка на событие модели
		this.model.bind('change', this.render, this);
	},        
	
    el: $("#block"), // DOM элемент widget'а

    events: {
        "click input:button": "check" // Обработчик клика на кнопке "Проверить"
    },

    check: function () {
		
        var username = this.$el.find("input:text").val();
        var find = MyFamily.checkUser(username); // Проверка имени пользователя
        appState.set({ // Сохранение имени пользователя и состояния
            "state": find ? "success" : "error",
            "username": username
        }); 
    },

    render: function () {
            var state = this.model.get("state");
            this.$el.html(this.templates[state](this.model.toJSON()));
            return this;
        }
});



///////////////////////////

var UserNameModel = Backbone.Model.extend({ // Модель пользователя
        defaults: {
            "Name": ""
        }
    });

var Family = Backbone.Collection.extend({ // Коллекция пользователей
        model: UserNameModel,
        checkUser: function (username) { // Проверка пользователя
            var findResult = this.find(function (user) { return user.get("Name") == username })
            return findResult != null;
        }
    });
        
var AppState = Backbone.Model.extend({
    defaults: {
        username: "",
        state: "start"
    }
});

Backbone.history.start();  // Запускаем HTML5 History push    



var controller = new Controller(); // Создаём контроллер
var appState = new AppState();
var block = new Block({ model: appState });
var MyFamily = new Family([ // Моя семья
                { Name: "Саша" },
                { Name: "Юля" },
                { Name: "Елизар" }
            ]);
appState.bind("change:state", function () { // подписка на смену состояния для контроллера
    var state = this.get("state");
    if (state == "start")
        controller.navigate("!/", {trigger:false}); // false потому, что нам не надо 
                                          // вызывать обработчик у Router
    else
        controller.navigate("!/" + state, {trigger:false});
});

appState.trigger("change");

    
    





