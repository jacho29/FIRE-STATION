//https://raw.githubusercontent.com/andrewhayward/dijkstra/master/graph.js
/* LICENSE INFO

The MIT License (MIT)

Copyright (c) 2014 Andrew Hayward
--------------
Modified in 2017 by Piotr Jaśkiewicz
--------------

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.                               

*/

var global_Cost,    //suma wag krawedzi
    temporary;      //maximum czasu przejazdu

var Graph = (function (undefined) {
    
    
	var extractKeys = function (obj) {
		var keys = [], key;
		for (key in obj) {
		    Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
		}
		return keys;
	}

	var sorter = function (a, b) {
		return parseFloat (a) - parseFloat (b);
	}

	var findPaths = function (map, start, end, infinity) {
		infinity = infinity || Infinity;

		var costs = {},
		    open = {'0': [start]},
		    predecessors = {},
		    keys;

		var addToOpen = function (cost, vertex) {
			var key = "" + cost;
			if (!open[key]) open[key] = [];
			open[key].push(vertex);
		}

		costs[start] = 0;

		while (open) {
			if(!(keys = extractKeys(open)).length) break;

			keys.sort(sorter);

			var key = keys[0],
			    bucket = open[key],
			    node = bucket.shift(),
			    currentCost = parseFloat(key),
			    adjacentNodes = map[node] || {};

			if (!bucket.length) delete open[key];

			for (var vertex in adjacentNodes) {
			    if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
					var cost = adjacentNodes[vertex],
					    totalCost = cost + currentCost,
					    vertexCost = costs[vertex];
                       

					if ((vertexCost === undefined) || (vertexCost > totalCost)) {
						costs[vertex] = totalCost;
						addToOpen(totalCost, vertex);
						predecessors[vertex] = node;
                       // costs[vertex];
					}
				}
			}
            
            global_Cost=costs[end];
                   if(global_Cost>temporary){
                global_Cost += " PRZEKROCZONY MAKSYMALNY CZAS REAKCJI!";
            }
            if(global_Cost==0 || global_Cost===null){
                global_Cost += " JEDNOSTKA ZNAJDUJE SIĘ W MIEŚCIE!";
            }
        
		}

		if (costs[end] === undefined) {
			return null;
		} else {
           
			return predecessors;
		}

	}

	var extractShortest = function (predecessors, end) {
		var nodes = [],
		    u = end;

		while (u) {
			nodes.push(u);
			u = predecessors[u];
		}

	//	nodes.reverse();        //odwraca kolejnosc sciezki
		return nodes;
	}

	var findShortestPath = function (map, nodes) {
		var start = nodes.shift(),
		    end,
		    predecessors,
		    path = [],
		    shortest;

		while (nodes.length) {
			end = nodes.shift();
			predecessors = findPaths(map, start, end);

			if (predecessors) {
				shortest = extractShortest(predecessors, end);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, -1));
				} else {
					return path.concat(shortest);
				}
			} else {
				return null;
			}

			start = end;
		}
	}

	var toArray = function (list, offset) {
		try {
			return Array.prototype.slice.call(list, offset);
		} catch (e) {
			var a = [];
			for (var i = offset || 0, l = list.length; i < l; ++i) {
				a.push(list[i]);
			}
			return a;
		}
	}

	var Graph = function (map) {
		this.map = map;
	}

	Graph.prototype.findShortestPath = function (start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			var temp=" "+findShortestPath(this.map, start) +"\t ŁĄCZNY CZAS: " +global_Cost;
            return temp;
		} else if (arguments.length === 2) {
			var temp=" "+findShortestPath(this.map, [start, end]) +"\t ŁĄCZNY CZAS: " +global_Cost;
            return temp;
		} else {
            var temp=" "+findShortestPath(this.map, toArray(arguments)) +"\t ŁĄCZNY CZAS: " +global_Cost;
			return temp;
		}
	}

	Graph.findShortestPath = function (map, start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			var temp= findShortestPath(map, start) +"\t  ŁĄCZNY CZAS: "  +global_Cost;
            return  
		} else if (arguments.length === 3) {
            var temp= findShortestPath(map, [start, end]) +"\t ŁĄCZNY CZAS: " +global_Cost;
			return temp;
		} else {
			var temp=  findShortestPath(map, toArray(arguments, 1)) + "\t ŁĄCZNY CZAS: " +global_Cost;
            return temp;
		}
	}

	return Graph;

})();


//http://codereview.stackexchange.com/questions/13443/jquery-plugin-node-tojson-convert-html-form-to-js-object

$.fn.toJSO = function () {
    var obj = {},
    $kids = $(this).children('[name]');
    if (!$kids.length) {
        return $(this).val();
    }
    $kids.each(function () {
        var $el = $(this),
        name = $el.attr('name');
        if ($el.siblings("[name=" + name + "]").length) {
            if (!/radio|checkbox/i.test($el.attr('type')) || $el.prop('checked')) {
                obj[name] = obj[name] || [];
                obj[name].push($el.toJSO());
            }
        } else {
            obj[name] = $el.toJSO();
        }
    });
    return obj;
};





$(document).ready(function(){
     $('#schow').hide();
     $('#awaria').hide();
        var obiekat={};  
        var func = function(obj){
            console.log( JSON.stringify( obj ) );
            obiekat=obj;
        };
    
    $("input[type='submit']").click(function () {
        func($("form").toJSO());
        $('#myForm').hide(500);
        $('#myForm2').hide(500);
        $('#niewazne').hide(500);
        $('#content').hide(1000);   
        temporary=parseInt(obiekat.max_czas_przejazdu); //max_czas_przejazu
         var result = obiekat.drogi.reduce(function(r, e) {
           e.miasta.forEach(function(c) {
             if(!r[c]) r[c] = {}
             e.miasta.forEach(function(n) {
               if(n != c)
                   Object.assign(r[c], {[n]: parseInt(e.czas_przejazdu)})
             })
           })
           return r
         }, {});
        $('#awaria').show(250);    
        for(property in obiekat.miasta){
        var something= $('<input/>').attr({ id:'awaryjne', type: 'button', name:obiekat.miasta[property].nazwa, value:obiekat.miasta[property].nazwa});
        something.click(function(){
            $('#result').append('\n\n');
            for(propertyz in obiekat.miasta){
                    if(obiekat.miasta[propertyz].ma_jednostke.toString() == "true"){
                       var graph = new Graph(result);
                        var wynik = graph.findShortestPath($(this).val().toString(),obiekat.miasta[propertyz].nazwa.toString());
                        $('#result').append(wynik+'\n');
                        $('#schow').show(200);
                    }
            }
        });
        
        $('#butony').append(something);
        }
    
 



        return false;
    });

    $('#dodaj_droge').click(function(){
         $('#myForm2').show(200);
       $('#myForm2').append('<fieldset name="drogi"> <label>Droga łącząca </label> <input name="miasta" value="" placeholder="np. Ciechocinek"/><label> z </label> <input name="miasta" value="" placeholder="np. Jastarnia"/> <label>Czas przejazdu </label> <input name="czas_przejazdu" type="number" value="" placeholder="liczba dodatnia"/></fieldset>');
    });
    
    $('#removex').click(function(){
       location.reload();
    });
    
    $('#dodaj_miasto').click(function(){
      $('#myForm').show(200);
      $('#myForm').append('<fieldset name="miasta"> <label>Nazwa Miasta </label> <input name="nazwa" value="" type="text" placeholder="np. Ciechocinek"/> <label>Czy posiada jednostkę straży pożarnej? </label> <select name="ma_jednostke"> <option value="true">Tak</option> <option value="false">Nie</option> </select> </fieldset>');
    });
    

});
 

