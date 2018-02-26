(function(window, $, socket) {


    //get 3 div components
    var unlabelledRow = $('div.row#unlabelled');
    var processingRow = $('div.row#processing');
    var labelledRow = $('div.row#labelled');
    //get modal
    var modalContent = $('#labelModal .modal-content');
    var setting = ""
    if (window.location.pathname === "/") {
        setting = "segment"
    } else if (window.location.pathname === "/platform") {
        setting = "platform"
    } else {
        setting = "error"
    }

    var triggerUnlabelled = function(event) {
        id = this.id
        console.log("div.col#" + id)
        clickedCard = $('div.col#' + id);
        image = clickedCard.find('img').attr('src')
        content = clickedCard.find('.card-content').attr('data-article');
        title = clickedCard.find('.card-title').text();
        date = clickedCard.find('.card-content p').text();
        url = clickedCard.find('.card-content a').attr('href');
        modalContent.append("<h4>" + title + "</h4><br>");
        modalContent.append("<img class = 'responsive-img' src = '" + image + "'></img><br>")
        modalContent.append(date + "<br>");
        modalContent.append("<a href='" + url + " target='newtab>Go to Article!</a>");
        modalContent.append("<br><br>" + content + "<br>")
        $('.modal-footer').find('a').attr('id', id);
        news_details = {
            "id": id,
            "type": setting
        }
        socket.emit('unlabelled clicked', news_details);
    };

    var cancelLabel = function(event) {
        id = this.id;
        console.log(id);
        news_details = {
            "id": id,
            "type": setting
        }
        socket.emit('cancel label', news_details);
        modalContent.empty()
    }

    var setLabelTrigger = function(event) {
        chosenLabel = $('select.label-choice').val()
        console.log("hello" + chosenLabel)
        currentTimestamp = formatDate(new Date())
        console.log(currentTimestamp)
        // platformLabel = $('select.platform-label :selected').val()
        if (chosenLabel == '') {
            Materialize.toast('Label the Article FIRST!', 2000);
        } else {
            id = this.id;
            labelInfo = {
                id: id,
                label: chosenLabel,
                timestamp: currentTimestamp,
                type: setting,
                // platform: platformLabel
            }
            socket.emit('label set', labelInfo);
            $('#labelModal').modal('close')
        }
        modalContent.empty()
    }
    $('a.set-label').on('click', setLabelTrigger)
    $('a.cancel-label').on('click', cancelLabel);
    $('.unlabelled-trigger').on('click', triggerUnlabelled);

    var dbUpdated = function(type) {
        if (type === "segment") {
            $.ajax({
                type: "GET",
                url: "http://192.168.0.15:3000/ajax-call-segment",
                success: function(response) {
                    var unlabelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}'>Go to Article!</a></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Label Article</a></div></div></div><div>");
                    var processingTemp = Handlebars.compile("<div class='col s12 m12 l6'><div class='card horizontal small' id = '{{news_id}}'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><a href='{{news_url}}'>Go to Article!</a></div></div></div></div>");
                    var labelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}' target='newtab'>Go to Article!</a><br><p class='sl' data = '{{segment_label}}'>Segment Label: {{segment_label}}</p><br></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Edit Article Label</a></div></div></div></div>");
                    unlabelledRow.empty()
                    processingRow.empty()
                    labelledRow.empty()
                    for (var i = 0; i < response['unlabelled'].length; i++) {
                        uR = unlabelledTemp(response['unlabelled'][i]);
                        unlabelledRow.append(uR);
                    }
                    for (var i = 0; i < response['processing'].length; i++) {
                        pR = processingTemp(response['processing'][i]);
                        processingRow.append(pR);
                    }
                    for (var i = 0; i < response['labelled'].length; i++) {
                        console.log(response['labelled']['segment_label']);
                        lR = labelledTemp(response['labelled'][i]);
                        labelledRow.append(lR);
                    }
                    $('.unlabelled-trigger').on('click', triggerUnlabelled);
                }
            });
        } else if (type === "platform") {
            $.ajax({
                type: "GET",
                url: "http://192.168.0.15:3000/ajax-call-platform",
                success: function(response) {
                    var unlabelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}'>Go to Article!</a></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Label Article</a></div></div></div><div>");
                    var processingTemp = Handlebars.compile("<div class='col s12 m12 l6'><div class='card horizontal small' id = '{{news_id}}'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><a href='{{news_url}}'>Go to Article!</a></div></div></div></div>");
                    var labelledTemp = Handlebars.compile("<div class='col s12 m12 l6' id = '{{news_id}}'><div class='card horizontal small'><div class='card-image'><img src='{{news_image}}'></div><div class='card-stacked'><div class='card-content' data-article = '{{news_content}}'><span class='card-title article-title darken-4'>{{news_title}}</span><p>{{news_date}}</p><br><a href='{{news_url}}' target='newtab'>Go to Article!</a><br><p class='pl' data = '{{platform_label}}'>Platorm Label: {{platform_label}}</p><br></div><div class='card-action'><a class='unlabelled-trigger modal-trigger' href='#labelModal' id='{{news_id}}'>Edit Article Label</a></div></div></div></div>");
                    unlabelledRow.empty()
                    processingRow.empty()
                    labelledRow.empty()
                    for (var i = 0; i < response['unlabelled'].length; i++) {
                        uR = unlabelledTemp(response['unlabelled'][i]);
                        unlabelledRow.append(uR);
                    }
                    for (var i = 0; i < response['processing'].length; i++) {
                        pR = processingTemp(response['processing'][i]);
                        processingRow.append(pR);
                    }
                    for (var i = 0; i < response['labelled'].length; i++) {
                        console.log(response['labelled']['platform_label']);
                        lR = labelledTemp(response['labelled'][i]);
                        labelledRow.append(lR);
                    }
                    $('.unlabelled-trigger').on('click', triggerUnlabelled);
                }
            });
        }
    };

    socket.on('db updated', dbUpdated);

    function formatDate(date) {
        return date.getFullYear() + '-' +
            (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' +
            (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
            (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
            (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    }
    var showCount = function() {
        console.log("showcount")
        $.ajax({
            type: "GET",
            url : "http://192.168.0.15:3000/counts",
            success : function(response){
                console.log(response)
                var toastContent = 'News: ' + response["segment"][0]['COUNT(*)'] + '\nTweets: ' + response["tweet"][0]['COUNT(*)']
                console.log(toastContent)
                Materialize.toast(toastContent,10000)
            }
        });
    }

    $('#getCount').on('click', showCount);




})(window, $, socket)
