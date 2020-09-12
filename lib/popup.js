
function openPopup(evt, popupName){
  // Declare all variables
  var i, popupContent, tablinks;

  // Get all elements with class="popupContent" and hide them
  popupContent = $(".popup");
  for (i = 0; i < popupContent.length; i++) {
    $("#"+popupContent[i].id).removeClass("show");
  }

	// Show the current tab, and add an "active" class to the button that opened the tab
	$("#"+popupName).addClass("show");
	$(evt.currentTarget).addClass("active");
}

function closePopup(evt, popupName){

	// Show the current tab, and add an "active" class to the button that opened the tab
	$("#"+popupName).removeClass("show");
	$(evt.currentTarget).removeClass("active");

}

(function($) {

  $("#share_image_url").change(function(e){

    let url = $('#share_image_url').val();
    if (url.trim()!="") {
      $("#share_image_preview").attr("src",url);
    }
      
  });

  $("#share_video_url").change(function (e) {
    popup_load_video_preview(e);
  });

  $("#share_video_type").change(function(e) {
    popup_load_video_preview(e);
  });

  $("#share_youtube_url").change(function (e) {
    popup_load_youtube_preview(e);
  });


})(jQuery);

function popup_load_video_preview(e){

  let url = $('#share_image_url').val();
  let type = $('#share_video_type').val();
  if (url.trim()!="") {
    $("#share_video_preview_source").attr("src",url);
    $("#share_video_preview_source").attr("type",type);
  }
}

function popup_load_youtube_preview(e){
  console.log("OK !");
  let url = $('#share_youtube_url').val();
  let url_tab = url.split("/");
  let id = url_tab[url_tab.length-1];

  //  on remplace ?t= par ?start=
  id.replace("?t=","?start=");

  if (url.trim()!="") {
    $("#share_youtube_preview").attr("src","https://www.youtube.com/embed/"+id);
  } 
}

function share(event, option) {

  
  let protocole, url, type;

  switch(option){

    case "share_image":
      protocole = "image";
      url = $('#share_image_url').val();
      break;

    case "share_video":
      protocole = "video";
      url = $('#share_video_url').val();
      type = $('#share_video_type').children("option:selected").val();
      break;

    case "share_youtube":
      protocole = "youtube";
      url = $('#share_youtube_url').val();
      break;
  }

  if (protocole!=null && url!=null) {
    
      
    let event = new CustomEvent('share',{"detail":{
      protocole:protocole,
      url:url,
      type:type
    }});

    document.dispatchEvent(event);

    closePopup(event, option);
    share_clear(option);
  }

}

function share_clear(option){
  $('#'+option+'_url').val("");
  $('#'+option+'_preview').attr("src","img/"+option+"-icon.png");
}