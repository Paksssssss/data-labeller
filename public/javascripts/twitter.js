(function(window,$,socket){

  // Handlebars.registerPartial('selector','')
  var unlabelledList = $('div#unlabelled-tab ul');
  var labelledList = $('div#labelled-tab ul');
  // console.log(Handlebars.templates)
  var labellerContent = $('#tweetModal div.modal-content');
  var options = '<option value="O">O</option><option value="B-game">B-GAME</option><option value="I-game">I-GAME</option><option value="B-sub">B-SUB</option><option value="I-sub">I-SUB</option><option value="B-plat">B-PLAT</option><option value="I-plat">I-PLAT</option><option value="B-event">B-EVENT</option><option value="I-event">I-EVENT</option><option value="B-per">B-PER</option><option value="I-per">I-PER</option><option value="B-com">B-COM</option><option value="I-com">I-COM</option>'
  var select = '<select class="ne-selector"><option value="" disabled selected>Choose your option</option>'+options+'</select>'

  var startLabelTrigger = function(event){
    id = this.id;
    clickedTweet = $('li#'+id);
    console.log(clickedTweet);
    tweet = clickedTweet.find('span').text().split(' ');
    pos = clickedTweet.attr('data-pos').split(' ');
    if(tweet.length!=pos.length){
      console.log("There must be something wrong here!")
    }
    for(var i=0; i<tweet.length;i++){
      labellerContent.append("<div class='valign-wrapper row center'>"+
                              "<div class='col s4 m4 l4'>"+tweet[i]+"</div>"+
                              "<div class='col s4 m4 l4'>"+pos[i]+"</div>"+
                              "<div class='col s4 m4 l4'>"+select+"</div>"+
                              "</div>");
      $('select').material_select();
    }
    var tweet_info = {
      "id" : id,
      "status" : 1
    }
    $('.modal-footer').find('a').attr('id',id);
    socket.emit('tweet clicked',tweet_info);
  };

  var setLabelTrigger = function(event){
    id = this.id;
    neTags = []
    currentTimestamp = formatDate(new Date())

    $('select.ne-selector').each(function(){
      var choice = $(this).val();
      neTags.push(choice)
    });
    if(neTags.some(function(val){return val===null})){
      Materialize.toast('Label all tokens FIRST!',4000);
      return;
    }
    tweet_info = {
      "id" : id,
      "ne_tags" : neTags.toString(),
      "timestamp" : currentTimestamp,
    }
    console.log(tweet_info)
    socket.emit('label tweet', tweet_info);
    $('#tweetModal').modal('close');
    labellerContent.empty()
  }

  $('a.set-tweet-label').on('click', setLabelTrigger);

  $('a.cancel-tweet-label').on('click', function(event){
    id = this.id;
    tweet_info = {
      "id" :id,
      "status" : 0
    }
    socket.emit('tweet cancelled',tweet_info);
    labellerContent.empty()
  });
  $('a.startlabel-trigger').on('click',startLabelTrigger);
  $('a.remove-tweet').on('click',function(event){
    id = this.id;
    socket.emit('remove tweet', id);
  });


  var updateList = function(){
    console.log("updating lists")
    $.ajax({
      type: "GET",
      url: "http://192.168.0.15:3000/ajax-call-tweets",
      success: function(response){
        var tweets = Handlebars.compile('<li class="collection-item" id="{{tweet_id}}" data-pos="{{tweet_pos}}"><span>{{tweet_text}}</span><br><a href="" class = "remove-tweet red-text" id = "{{tweet_id}}">Remove Tweet</a><a href="#tweetModal" class="secondary-content modal-trigger startlabel-trigger" id="{{tweet_id}}"><i class="material-icons">send</i></a></li>')
        unlabelledList.empty()
        labelledList.empty()
        console.log("in ajax function now")
        for(var i=0;i<response['unlabelled'].length;i++){
          tw = tweets(response['unlabelled'][i]);
          unlabelledList.append(tw);
        }
        for(var i=0;i<response['labelled'].length;i++){
          tw = tweets(response['labelled'][i]);
          labelledList.append(tw);
        }
        $('a.startlabel-trigger').on('click',startLabelTrigger);
      }
    });
  };
  socket.on('update list', updateList);

  function formatDate(date){
    return date.getFullYear() + '-' +
    (date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1) + '-'+
    (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
    (date.getHours() < 10 ? '0' : '')+ date.getHours()+ ':' +
    (date.getMinutes() < 10 ? '0' : '')+ date.getMinutes() + ':' +
    (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
  }

})(window,$,socket)
