$(document).ready(function(){
  $('.collapsible').collapsible();
  $('.modal').modal({
    dismissible: false
  });
  $('select').material_select();
  $(".dropdown-button").dropdown();
  $('ul.tabs').tabs();
});
