console.log("Bienvenue au Coding Dojo :)");

var todos = [];

var socket = io.connect('http://localhost:8080');
socket.on('todos', function (_todos) {
    todos = _todos;
    renderTodos();
});

document.querySelector('#todolist_form').addEventListener('submit', function (e) {
    e.preventDefault();
    socket.emit('todo:add', document.querySelector('#todolist_form input').value);
    document.querySelector('#todolist_form input').value = '';
});

var todolist = document.getElementById('todoliste');
function renderTodos() {
    todolist.innerHTML = '';
    todos.forEach(function (todo) {
        todolist.innerHTML +=
            '<li>' +
            '<span onclick="removeTodo('+ todo.id +')">&times;</span>' +
            '<input type="checkbox" onchange="checkTodo(' + todo.id + ')" ' + (todo.checked ? ' checked' : '') + '/> '
            + todo.text
            + '</li>'
    });
}

function checkTodo(todoId) {
    socket.emit('todo:check', todoId);
}
function removeTodo(todoId) {
    socket.emit('todo:remove', todoId);
}

renderTodos();