(function(window,$,socket){
  $('.collapsible').collapsible();
  $('.modal').modal({
    dismissible: false
  });

  var unlabelledRow = $('div.row#unlabelled');
  var processingRow = $('div.row#processing');
  var labelledRow = $('div.row#labelled');

  var triggerUnlabelled = function(event){
    modalContent = $('#labelModal .modal-content');
    id = this.id
    console.log("div.col#"+id)
    clickedCard = $('div.col#'+id);
    image = clickedCard.find('img').attr('src')
    content = clickedCard.find('.card-content').attr('data-article');
    title = clickedCard.find('.card-title').text()
    date = clickedCard.find('.card-content p').text()
    url = clickedCard.find('.card-content a')
    console.log(image)
    // console.log(processingRow.html())
    modalContent.append("<h3>"+title+"</h3>");
    modalContent.append("<img class = 'responsive-img' src = '"+image+"'></img>")
    modalContent.append(date+"<br>");
    modalContent.append(url);
    modalContent.append("<br>"+content+"<br>")
    $('.modal-footer').find('a').attr('id',id);
    socket.emit('unlabelled clicked', id);
  };

  var cancelLabel = function(event){
    id = this.id;
    console.log(id)
    socket.emit('cancel label', id);
  }

  $('a.cancel-label').on('click',cancelLabel);
  $('.unlabelled-trigger').on('click', triggerUnlabelled);

  var dbUpdated = function(){
    console.log('db updated')
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/ajax-call",
      success: function(response) {
        var unlabelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}'>Go to Article!</a></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Label Article</a></div></div></div><div>");
        var processingTemp = Handlebars.compile("<div class='col s12 m12 l6'><div class='card horizontal small' id = '{{news_id}}'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><a href='{{news_url}}'>Go to Article!</a></div></div></div></div>");
        var labelledTemp = Handlebars.compile(labelledRow.html());
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
          lR = labelledTemp(response['labelled'][i]);
          labelledRow.append(lR);
        }
        $('.unlabelled-trigger').on('click', triggerUnlabelled);
      }
    });
  };

  socket.on('db updated', dbUpdated);
})(window,$,socket)
