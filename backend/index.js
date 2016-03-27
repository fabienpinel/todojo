var io = require('socket.io')(8080);

var todoId = 0;
var todos = [];

io.on('connection', function (socket) {

    socket.emit('todos', todos);

    socket.on('todo:add', function (text) {
        if (typeof text === 'string') {
            todos.push({
                text: text,
                checked: false,
                id: todoId++
            });
            socket.emit('todos', todos);
        }
    });

    socket.on('todo:remove', function (id) {
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id == id) {
                todos.splice(i, 1);
                socket.emit('todos', todos);
                break;
            }
        }
    });

    socket.on('todo:check', function (id) {
        for (var i = 0; i < todos.length; i++) {
            if (todos[i].id == id) {
                todos[i].checked = !todos[i].checked;
                socket.emit('todos', todos);
                break;
            }
        }
    });

});