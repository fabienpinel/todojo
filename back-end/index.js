/* read the initial data when we load the server */
var fs = require('fs'); // require a module that exists in NodeJS
var data = JSON.parse(fs.readFileSync('./data.json', {encoding: 'utf8'}));

// initialization of global instance
var todos = data.todos;
var lastTodoId = data.lastTodoId;

/* create the server */
var io = require('socket.io')(8080); // require a module that we have downloaded


io.on('connection', function (socket) {

    /* every time we have a new connexion, we go here */

    // emit the data so that the new client can get the actual version of the todos
    socket.emit('todos', todos);

    // add a todo
    socket.on('todo:add', function (todo) {

        // add it to local memory
        todos.push({
            id: ++lastTodoId,
            text: todo.text,
            date: todo.date,
            checked: false
        });

        // write in a file for persistance (if server shut down)
        fs.writeFileSync('./data.json', JSON.stringify({ lastTodoId: lastTodoId, todos: todos }) );

        // send to all people connected the new version of the todolist
        io.sockets.emit('todos', todos);
    });

    socket.on('todo:remove', function (id) {

        // delete the todo in the local memory
        todos = todos.filter(function (todo) {
            return todo.id !== id;
        });

        // write in a file for persistance (if server shut down)
        fs.writeFileSync('./data.json', JSON.stringify({ lastTodoId: lastTodoId, todos: todos }) );

        // send to all people connected the new version of the todolist
        io.sockets.emit('todos', todos);
    });

    socket.on('todo:checked', function (id) {

        // check the todo in the local memory
        todos.forEach(function (todo) {
            if (todo.id === id) {
                todo.checked = !todo.checked
            }
        });

        // write in a file for persistance (if server shut down)
        fs.writeFileSync('./data.json', JSON.stringify({ lastTodoId: lastTodoId, todos: todos }) );

        // send to all people connected the new version of the todolist
        io.sockets.emit('todos', todos);
    });

});