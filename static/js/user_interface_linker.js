window.onload = init;

ui = {}

function init() {

    ui.flybridge_on = document.getElementById('flybridge_on');
    ui.flybridge_off = document.getElementById('flybridge_off');
    ui.courtesy_on = document.getElementById('courtesy_on');
    ui.courtesy_off = document.getElementById('courtesy_off');
    ui.flybridge_status = document.getElementById('flybridge_status');
    ui.courtesy_status = document.getElementById('courtesy_status');
    ui.ladder_on = document.getElementById('ladder_on');
    ui.ladder_off = document.getElementById('ladder_off');
    ui.anchor_area_on = document.getElementById('anchor_area_on');
    ui.anchor_area_off = document.getElementById('anchor_area_off');
    ui.all_on = document.getElementById('all_on');
    ui.all_off = document.getElementById('all_off');
}

export default ui;