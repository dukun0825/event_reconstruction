Rashomon = {};

Rashomon.loggedIn = function () {
  $("#upload").toggle();
  $("#auth").toggle();
  $.ajax({
    type: 'POST',
    url: 'admin.php', // This is a URL on your website.
    dataType: 'JSON',
    data: {
      assertion: auth.assertion,
      "task": "login"
    },
    success: function (res, status, xhr) {

      $.each(res, function (index, value) {

        var uploadTime = moment.unix(value.uploadDate.sec).toDate();
        
        
        var container = $("<div/>", {
          "class": "media"
        }).appendTo("#media");
        //var containerList = $("<ul/>").appendTo(container);

        var delbutton = $("<div/>", {
          "class": "delete",
          "text": "Delete",
          "title": 'Delete this media'
        }).appendTo(container);
        delbutton.click(function () {
          if (confirm("Are you sure? This will permenently delete associated media.")) {
            deleteMedia(value.name, container);
          }
        });
        var use = $("<div/>", {
          'class': 'check'
        }).appendTo(container);
        $("<input/>", {
          "class": "use",
          "type": "checkbox",
          "name": "use",
          "value": value.name
        }).appendTo(use);
        $("<h1/>", {
          "text": value.name,
          "title": value.origname
        }).appendTo(use);
        var meta = $("<div/>", {
          "class": "meta",
          "text": "Time: "
        }).appendTo(container);
        var c = 0;
        var stime;
        if (value.times) {
          $.each(value.times, function (i, v) {
            c++;
            stime = v;
          });

          var times = $("<select/>", {
            "class": value.name
          }).appendTo(meta);

          $.each(value.times, function (i, v) {
            $("<option/>", {
              "value": moment(formatDate(v)).unix(),
              "text": i + ": " + formatDate(v)
            }).appendTo(times);
          });

        }


        if (value.Duration) {

          console.log(value.Duration);
          $("<span/>", {
            text: " • Type: " + value.type
          }).appendTo(meta);
          if (value.Duration.length !== -1) {
            $("<span/>", {
              "text": " • Duration: " + value.Duration
            }).appendTo(meta);
            var content = $("<section/>", {
              "class": "content"
            }).before(meta);
            var vid = $("<video/>", {
              "class": "vid",
              "controls": true,
              "preload": "metadata"
            }).appendTo(content);
            $("<source>", {
              "src": "http://rashomonproject.org/redacted/" + value.name + "_small.mp4"
            }).appendTo(vid);
            $("<source>", {
              "src": "http://rashomonproject.org/redacted/" + value.name + "_small.webm"
            }).appendTo(vid);
          }
        } else {
            var content = $("<section/>", {
              "class": "content"
            }).before(meta);
            var vid = $("<img/>", {
              "class": "vid",
              "src": "http://rashomonproject.org/redacted/" + value.name + "_small.jpg",
            }).appendTo(content);

        }
             $("<div/>", {
            text: "Uploaded: " + uploadTime
          }).appendTo(meta);
          $("<div/>", {
            text: "Original name: " + value.origname
          }).appendTo(meta);

      })
    },
    error: function (xhr, status, err) {
      alert("Login .failure: " + err + " " + status);
      console.dir(xhr);
    }
  });


};

var deleteMedia = function (name, container) {

  $.ajax({
    type: 'POST',
    url: 'admin.php',
    dataType: 'JSON',
    xhrFields: {
      withCredentials: true
    },
    data: {
      "name": name,
      "task": "delete"
    },
    success: function (res, status, xhr) {
      console.log(res);
      container.fadeToggle(1500);
    },
    error: function (xhr, status, err) {
      alert("deletion failure" + err);
    }
  });
};

$(document).ready(function () {
  $("#build").click(function () {
    console.log("cuh-lick");
    var items = [];
    $('input:checked').each(function () {
      var nom = $(this).val();
      var it = {
        "name": nom,
        "time": $('select.' + nom).val()
      };
      items.push(it);
    });

    $.ajax({
      type: 'POST',
      url: 'admin.php',
      dataType: 'JSON',
      xhrFields: {
        withCredentials: true
      },
      data: {
        "use": items,
        "task": "create"
      },
      success: function (res, status, xhr) {
        console.log(res);
      },
      error: function (xhr, status, err) {
        alert("Chronology creation failure" + err);
      }
    });

  });
});
formatDate = function (exifDate) {
  if (!exifDate) {
    return false;
  }
  //input format looks like "YYYY:MM:DD HH:MM:SS:mm-05:00" (-05:00 is timezone)
  var momentDate = moment(exifDate, "YYYY:MM:DD HH:mm:ss:SS Z");
  return momentDate.toDate();

};