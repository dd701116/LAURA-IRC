function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = $(".tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    $("#"+tabcontent[i].id).removeClass("show");
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = $(".tablinks");
  for (i = 0; i < tablinks.length; i++) {
    $(tablinks[i]).removeClass("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  $("#"+tabName).addClass("show");
  evt.currentTarget.className += " active";
}

function openView(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  let client_banned = getCookie("client_banned");

  if (client_banned!=null && client_banned) {

    if (!(tabName=="SERVER_ALERT_TMP_BAN" || tabName=="SERVER_ALERT_UNBAN")) {
      tabName="SERVER_ALERT_TMP_BAN";
    }
      
  }
  // Get all elements with class="tabcontent" and hide them
  tabcontent = $(".view");
  for (i = 0; i < tabcontent.length; i++) {
    $("#"+tabcontent[i].id).removeClass("show");
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = $(".viewlinks");
  for (i = 0; i < tablinks.length; i++) {
    $(tablinks[i]).removeClass("active");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  $("#"+tabName).addClass("show");

  if (evt!=null) {evt.currentTarget.className += " active";}
  
}