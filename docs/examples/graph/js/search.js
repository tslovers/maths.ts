const DEFAULT_RADIUS = 2;
const COLORS = {
    dots: 'rgba(0, 255, 0, 0.5)',
    edges: 'rgba(0, 0, 0, 0.3)',
    polygonStroke: 'rgba(0, 0, 255, 1)',
    polygonFill: 'rgba(0, 0, 255, 0.5)',
    solution: 'red'
};
var dots = [];
var polygons = [];
var everyLine = [];
var start, finish;
var graph;

/**
 * Solves with the given
 */
function solve() {
    var algorithm = $('#search').val();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0; i < polygons.length; i++)
        drawPolygon(polygons[i]);
    defineGraph();
    var log = [];
    if (algorithm === 'ucs')
        mathsts.graphs.ucs(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);
    else if (algorithm === 'aStar')
        mathsts.graphs.aStar(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);
    else if (algorithm === 'bfs')
        mathsts.graphs.bfs(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);
    else if (algorithm === 'dfs')
        mathsts.graphs.dfs(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);
    else if (algorithm === 'greedy')
        mathsts.graphs.greedySearch(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);
    else
        mathsts.graphs.idfs(graph, getVertexNumber(polygons.length - 2, 0), getVertexNumber(polygons.length - 1, 0), log);

    var sol = log[log.length - 1];
    if ('Solution' === sol.stepName) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.strokeStyle = COLORS.solution;
        for (var j = 1; j < sol.stepInfo.trail.length; j++) {
            var v = getVertex(sol.stepInfo.trail[j]);
            ctx.lineTo(v.x, v.y);
        }
        ctx.stroke();
    }
    var $logger = $('#logger');
    for (var i = 0; i < log.length; i++) {
        if (log[i].stepInfo.idVertexList) {
            var v = getVertex(log[i].stepInfo.idVertexList[0].id);
            var $li = $('<li>', {
                html: '[(' + v.x + ', ' + v.y + '): ' + log[i].stepInfo.idVertexList[0].cost.toFixed(2) + ']<br>'
            }).on('click', function () {
                var dis = $(this).find('p').css('display');
                $(this).find('p').css('display', dis === 'none' ? 'block' : 'none');
            });
            for (var j = 1; j < log[i].stepInfo.idVertexList.length; j++) {
                v = getVertex(log[i].stepInfo.idVertexList[j].id);
                $li.append($('<p>', {
                    html: '[(' + v.x + ', ' + v.y + '): ' + log[i].stepInfo.idVertexList[j].cost.toFixed(2) + ']'
                }).css('display', 'none'));
            }
            $logger.append($li);
        }
    }
    $stateButtons.first().click();
}

/**
 * Defines the polygons according to global dots.
 */
function addPolygon() {
    if (dots.length === 0)
        return;
    else if (dots.length > 2) {
        var convex = new ConvexHullGrahamScan();
        for (var i = 0; i < dots.length; i++)
            convex.addPoint(dots[i].x, dots[i].y);
        dots = convex.getHull();
    }
    polygons.push(dots);
    drawPolygon(dots);
    dots = [];
}

/**
 * Initialize graph by adding vertexes, beginning, ending and edges.
 */
function defineGraph() {
    var i, j, k, m, n, intersection;
    graph = new mathsts.graph.Graph(0, false);
    graph.setHeuristic(distance);
    polygons.forEach(function (p) {
        p.forEach(function (v) {
            graph.addVertex('(' + v.x + ', ' + v.y + ')', v);
        });
    });
    graph.addVertex('(' + start.x + ', ' + start.y + ')', start);
    graph.addVertex('(' + finish.x + ', ' + finish.y + ')', finish);
    everyLine = [];
    for (i = 0; i < polygons.length; i++)
        for (j = 0; j < polygons[i].length; j++)
            everyLine.push({
                from: polygons[i][j],
                to: polygons[i][(j + 1) % polygons[i].length],
                polygon: i
            });

    ctx.strokeStyle = COLORS.edges;
    ctx.beginPath();
    polygons.push([start]);
    polygons.push([finish]);
    for (i = 0; i < polygons.length; i++) {
        for (j = 0; j < polygons[i].length; j++) {
            if (!isValidVertex(i, j))
                continue;
            var edge = {
                from: polygons[i][j],
                to: polygons[i][(j + 1) % polygons[i].length]
            }
            if (polygons[i].length > 1 && isValidEdge(edge, i, i)) {
                // edges.push(edge);
                graph.addEdge(getVertexNumber(i, j), getVertexNumber(i, (j + 1) % polygons[i].length), distance);
            }
            for (k = i + 1; k < polygons.length; k++) {
                for (m = 0; m < polygons[k].length; m++) {
                    edge = {
                        from: polygons[i][j],
                        to: polygons[k][m]
                    };
                    if (isValidVertex(k, m) && isValidEdge(edge, i, k)) {
                        graph.addEdge(getVertexNumber(i, j), getVertexNumber(k, m), distance);
                        ctx.beginPath();
                        ctx.moveTo(edge.from.x, edge.from.y);
                        ctx.lineTo(edge.to.x, edge.to.y);
                        ctx.stroke();
                    }
                }
            }
        }
    }
}

function getVertexNumber(i, j) {
    var g = 0;
    for (var k = 0; k < i; k++)
        g += polygons[k].length;
    return g + j;
}

function getVertex(n) {
    var g = 0;
    for (var i = 0; i < polygons.length; i++)
        if (polygons[i].length + g > n)
            return polygons[i][n - g];
        else
            g += polygons[i].length;
    return undefined;
}

/**
 * Checks if the given vertex is not inside a polygon.
 * @param i The polygon of the vertex.
 * @param j The vertex in polygon.
 * @return {boolean}
 */
function isValidVertex(i, j) {
    var inside = false;
    var x = polygons[i][j].x;
    var y = polygons[i][j].y;

    for (var n = 0; n < polygons.length; n++) {
        if (i === n)
            continue;
        var vs = polygons[n];
        for (var k = 0, l = vs.length - 1; k < vs.length; l = k++) {
            var xi = vs[k].x, yi = vs[k].y;
            var xj = vs[l].x, yj = vs[l].y;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
    }

    return !inside;
    // return isValidEdge({from: polygons[i][j], to: polygons[i][(j + 1) % polygons[i].length]}, i, i) ||
//        isValidEdge({from: polygons[i][j], to: polygons[i][j === 0 ? polygons[i].length - 1 : j - 1]}, i, i);
}

/**
 * Checks if an edge is valid.
 * @param edge The edge to check.
 * @param i What polygon does the edge source belongs.
 * @param k What polygon does the edge destination belongs.
 * @return {boolean} If is a valid edge.
 */
function isValidEdge(edge, i, k) {
    for (var n = 0; n < everyLine.length; n++) {
        if (everyLine[n].polygon === i &&
            ((everyLine[n].from.x === edge.from.x && everyLine[n].from.y === edge.from.y) ||
            (everyLine[n].to.x === edge.from.x && everyLine[n].to.y === edge.from.y)))
            continue;
        if (everyLine[n].polygon === k &&
            ((everyLine[n].from.x === edge.to.x && everyLine[n].from.y === edge.to.y) ||
            (everyLine[n].to.x === edge.to.x && everyLine[n].to.y === edge.to.y)))
            continue;
        if (hasIntersect(edge, everyLine[n]))
            return false;
    }
    return true;
}

/**
 * Draws the polygon given by the array of dots.
 * @param dots
 */
function drawPolygon(dots) {
    ctx.beginPath();
    if (dots.length === 1) {
        ctx.fillStyle = COLORS.polygonStroke;
        ctx.arc(dots[0].x, dots[0].y, DEFAULT_RADIUS, 0, 2 * Math.PI);
    } else {
        ctx.strokeStyle = COLORS.polygonStroke;
        ctx.fillStyle = COLORS.polygonFill;
        ctx.moveTo(dots[0].x, dots[0].y);
        for (var i = 1; i < dots.length; i++)
            ctx.lineTo(dots[i].x, dots[i].y);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.fill();
}

/**
 * Clears all information in the program so a new model may be added.
 */
function clearGraph() {
    while (state > 0)
        $stateButtons.first().click();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    graph = undefined;
    polygons = [];
    dots = [];
    everyLine = [];
}

/**
 * Handles what to do when canvas is clicked.
 * @param e The clicked canvas event.
 */
function canvasHandler(e) {
    var dot = {
        x: e.offsetX,
        y: e.offsetY
    };

    if (state === 0) { // Defining dots from polygons
        dots.push(dot);
        ctx.fillStyle = COLORS['dots'];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    } else if (state === 1) { // Defining start
        ctx.clearRect(start.x - DEFAULT_RADIUS / 2, start.y - DEFAULT_RADIUS / 2, DEFAULT_RADIUS, DEFAULT_RADIUS);
        start = dot;
        ctx.fillStyle = COLORS['dots'];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    } else if (state === 2) { // Defining finish
        ctx.clearRect(finish.x - DEFAULT_RADIUS / 2, finish.y - DEFAULT_RADIUS / 2, DEFAULT_RADIUS, DEFAULT_RADIUS);
        finish = dot;
        ctx.fillStyle = COLORS['dots'];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}

/**
 * Gets where a intersects b.
 * This function assumes a and b are not parallel lines.
 * As the two lines are not defined as function but as two dots the intersections is calculated
 * with determinants. See: https://en.wikipedia.org/wiki/Line-line_intersection
 */
function hasIntersect(a, b) {
    var eps = 0.0000001;
    return segment_intersection(a.from.x, a.from.y, a.to.x, a.to.y,
        b.from.x, b.from.y, b.to.x, b.to.y);

    function between(a, b, c) {
        return a - eps <= b && b <= c + eps;
    }

    function segment_intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
            ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y))
            return false;
        else {
            if (x1 >= x2) {
                if (!between(x2, x, x1))
                    return false;
            } else {
                if (!between(x1, x, x2))
                    return false;
            }
            if (y1 >= y2) {
                if (!between(y2, y, y1))
                    return false;
            } else {
                if (!between(y1, y, y2))
                    return false;
            }
            if (x3 >= x4) {
                if (!between(x4, x, x3))
                    return false;
            } else {
                if (!between(x3, x, x4))
                    return false;
            }
            if (y3 >= y4) {
                if (!between(y4, y, y3))
                    return false;
            } else {
                if (!between(y3, y, y4))
                    return false;
            }
        }
        return true;
    }
}

function distance(va, vb) {
    return Math.sqrt(Math.pow(va.info.x - vb.info.x, 2) + Math.pow(va.info.y - vb.info.y, 2));
}
