$(function(){ //DOM Ready

   var gridster = $("#wrapper ul").gridster({
   		widget_base_dimensions: [200, 200],
   		widget_margins: [10, 10],
   		max_cols: 5,
   		min_cols: 5,
   		min_rows: 5,
   		max_rows: 5
   }).data('gridster');

   gridster.add_widget('<li class="new"></li>', 2, 1);
   gridster.add_widget('<li class="new"></li>', 1, 1);

});