(function(window){
    var data = [];
    var cursor = {};
    
    document.addEventListener('mousemove', function(evt) {
        cursor = { x:evt.clientX, y:evt.clientY };
    }, false);
    
    
    function addPoint(point) {    
        point.count = +(new Date());
        data.push(point);
        
        var previous = data[data.length-2];    
        if (previous)
            previous.count = point.count - previous.count        
    }
    
    function updateData () {
        var latest = data[data.length-1];
        
        if (
            !latest || 
            Math.abs(latest.x - cursor.x) > 5 || 
            Math.abs(latest.y - cursor.y) > 5
           ) 
        {
               addPoint(cursor);
        }        
    }
    
    var timer;
    function toggleTracking() {
        if (timer) {
            clearInterval(timer);
            
            // Fixing last element
            var latest = data[data.length-1];
            latest.count = +(new Date()) - latest.count;
            
            visualize();
        } else {
            data = [];
            timer = setInterval(updateData, 30);
        }
    }

    function visualize(){
        var config = {
            "radius": 30,
            "element": document.body,
            "visible": true,
            "opacity": 40,
            "gradient": { 0.45: "rgb(0,0,255)", 0.55: "rgb(0,255,255)", 0.65: "rgb(0,255,0)", 0.95: "yellow", 1.0: "rgb(255,0,0)" }
        };
        
        var heatmap = heatmapFactory.create(config);
        
        var max = 0;
        for (var i=0; i < data.length; i++) {
            if (data[i].count > max) max = data[i].count;
        }
        
        heatmap.store.setDataSet({max: max, data: data });
    }
    
    var toggle = [
        "<div id='_toggle_mouse_recording' style='",
            "position:fixed;",
            "top:10px; left: 10px;",
            "background: white",
            "color: green;",
            "font-size: 20px;",
            "cursor:pointer;",
            "z-index: 1000000;",
        "'>►</div>"
    ].join('');
    
    document.body.innerHTML += toggle;
    
    var toggle_el = document.getElementById('_toggle_mouse_recording');
    
    toggle_el.addEventListener('click', function(){
            toggleTracking();

            if (timer) {
                toggle_el.style.color = 'red';
                toggle_el.innerHTML = '●';
            } else {
                toggle_el.style.color = 'green';
                toggle_el.innerHTML = '►';
            }
    }, false);
        
}(window))