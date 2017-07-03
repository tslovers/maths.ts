const states = [
    {
        name: 'Defining dots',
        prev: '',
        next: 'Define start'
    },
    {
        name: 'Defining start',
        prev: 'Define dots',
        next: 'Define end'
    },
    {
        name: 'Defining end',
        prev: 'Define start',
        next: 'Solve'
    },
    {
        name: 'Solving',
        prev: 'Define end',
        next: ''
    }
];

var state;
var ctx;

$(document).ready(function () {
    state = 0;
    var $clearButton = $('#clear').on('click', clearGraph);
    var $addButton = $('#addPolygon').on('click', addPolygon);
    var $stateButtons = $('button.state-button');
    var $canvas = $('<canvas>').appendTo('#canvas-container');
    ctx = $canvas[0].getContext('2d');
    ctx.canvas.width = $canvas.parent().innerWidth();
    ctx.canvas.height = $canvas.parent().innerHeight();
    start = {x: 0, y: 0};
    finish = {x: ctx.canvas.width, y: ctx.canvas.height};

    $('form').on('submit', function () {
        return false;
    });
    $('.instructions label').on('click', function () {
        var $target = $('#' + $(this).attr('for'));
        $target.css('display', ($target.css('display') === 'none') ? 'block' : 'none');
    });
    $stateButtons.on('click', statesHandler);
    $canvas.on('click', canvasHandler);

    statesHandler();

    function statesHandler() {
        var leftState = state;
        // Updates state
        if (this === $stateButtons[0]) // Previous
            state--;
        else if (this === $stateButtons[1]) // Next
            state++;
        // Updates status
        $('#state').html(states[state].name);
        // Able or disable draw polygonStroke button according to state
        $addButton.attr('disabled', state !== 0);
        // Changes button legends and able/disable them if applies
        $stateButtons.first()
            .attr('disabled', states[state].prev.length === 0)
            .html(states[state].prev);
        $stateButtons.last()
            .attr('disabled', states[state].next.length === 0)
            .html(states[state].next);
        if (state === 3)
            solve();
    }
});