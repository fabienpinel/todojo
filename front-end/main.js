var todos = [];

// connect to the server to get todos
var socket = io.connect('http://localhost:8080');
socket.on('todos', function (_todos) {
    // when we receive todos we render it
    todos = _todos;
    render();
});

function render() {
    // memorize the DOM node
    var todolist = $('#todoliste');
    todolist.empty(); // make it empty
    todos
        // the .filter above is for the search query
        // filter only the element containing the input given by the user
        .filter(function (todo) {
            return todo.text.indexOf(filter) >= 0;
        })
        .forEach(function (todo) {

            // onDelete and onChange are defined just after in the code
            todolist.append(
                '<li>' +
                '<span class="delete" onclick="onDelete(' + todo.id + ')">&times</span>' +
                '<input type="checkbox"' + (todo.checked ? 'checked' : '') + ' onchange="onCheck(' + todo.id + ')">' +
                '<span' + (todo.checked ? ' class="checked"' : '') + '>' + todo.text + ' pour le ' + todo.date + '</span>' +
                '</li>'
            );

        });
}

function onCheck(id) {
    socket.emit('todo:checked', id);
}

function onDelete(id) {
    socket.emit('todo:remove', id);
}

// Listening to the SUBMIT event of the form
$('#todolist_form').on('submit', function (e) {
    e.preventDefault(); // prevent default so that we avoid the form to reload the page
    var text = $('#todolist_form input[type="text"]');
    var date = $('#todolist_form input[type="date"]');
    socket.emit('todo:add', {text: text.val(), date: date.val()});
    text.val('');
    render();
});

var filter = '';

// Listening to the keyup event of the keyboard on the input so that we can update the filter
$("#filter").on("keyup", function () {
    filter = $("#filter").val();
    render();
});