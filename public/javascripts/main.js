(function(window,$,socket){
  $('.collapsible').collapsible();
  $('.modal').modal({
    dismissible: false
  });
  $('select').material_select();

  var unlabelledRow = $('div.row#unlabelled');
  var processingRow = $('div.row#processing');
  var labelledRow = $('div.row#labelled');

  var modalContent = $('#labelModal .modal-content');
  var triggerUnlabelled = function(event){
    id = this.id
    console.log("div.col#"+id)
    clickedCard = $('div.col#'+id);
    image = clickedCard.find('img').attr('src')
    content = clickedCard.find('.card-content').attr('data-article');
    title = clickedCard.find('.card-title').text();
    date = clickedCard.find('.card-content p').text();
    url = clickedCard.find('.card-content a').attr('href');
    modalContent.append("<h4>"+title+"</h4><br>");
    modalContent.append("<img class = 'responsive-img' src = '"+image+"'></img><br>")
    modalContent.append(date+"<br>");
    modalContent.append("<a href='"+url+" target='newtab>Go to Article!</a>");
    modalContent.append("<br><br>"+content+"<br>")
    $('.modal-footer').find('a').attr('id',id);
    socket.emit('unlabelled clicked', id);
  };

  var cancelLabel = function(event){
    id = this.id;
    console.log(id);
    socket.emit('cancel label', id);
    modalContent.empty()
  }

  var setLabelTrigger = function(event){
    segmentLabel = $('select.segment-label :selected').val()
    platformLabel = $('select.platform-label :selected').val()
    if (platformLabel == '' || segmentLabel == '') {
      Materialize.toast('Label the Article FIRST!',2000);
    } else {
      id = this.id;
      labelInfo = {
        id: id,
        segment: segmentLabel,
        platform: platformLabel
      }
      socket.emit('label set', labelInfo);
      $('#labelModal').modal('close')
    }
    modalContent.empty()
  }
  $('a.set-label').on('click',setLabelTrigger)
  $('a.cancel-label').on('click',cancelLabel);
  $('.unlabelled-trigger').on('click', triggerUnlabelled);

  var dbUpdated = function(){
    $.ajax({
      type: "GET",
      url: "http://192.168.0.15:3000/ajax-call",
      success: function(response) {
        var unlabelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}'>Go to Article!</a></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Label Article</a></div></div></div><div>");
        var processingTemp = Handlebars.compile("<div class='col s12 m12 l6'><div class='card horizontal small' id = '{{news_id}}'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><a href='{{news_url}}'>Go to Article!</a></div></div></div></div>");
        var labelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}' target='newtab'>Go to Article!</a><br><p class='pl' data = '{{platform_label}}'>Platform Label: {{platform_label}}</p><p class='sl' data = '{{segment_label}}'>Segment Label: {{segment_label}}</p><br></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Edit Article Label</a></div></div></div></div>");
        unlabelledRow.empty()
        processingRow.empty()
        labelledRow.empty()
        for(var i= 0;i<response['unlabelled'].length;i++){
          uR = unlabelledTemp(response['unlabelled'][i]);
          unlabelledRow.append(uR);
        }
        for(var i= 0;i<response['processing'].length;i++){
          pR = processingTemp(response['processing'][i]);
          processingRow.append(pR);
        }
        for(var i= 0;i<response['labelled'].length;i++){
          console.log(response['labelled']['segment_label']);
          lR = labelledTemp(response['labelled'][i]);
          labelledRow.append(lR);
        }
        $('.unlabelled-trigger').on('click', triggerUnlabelled);
      }
    });
  };

  socket.on('db updated', dbUpdated);
})(window,$,socket)
