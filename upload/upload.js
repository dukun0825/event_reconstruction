$(document).ready(function(){
   /* document.getElementById("db-chooser").addEventListener("DbxChooserSuccess",
        function(e) {
            console.log("Here's the chosen file: " + e.files[0].link);
        }, false);
   */
     $("#db-chooser").click(function(){

         Dropbox.choose({
              linktype: "direct",
              success: function(files){
                  //console.log("woohoo");
                  var values = {};      
                  $(".ask").each(function(key, item){
                      values[($(item).attr('name'))] = $(item).val();
                  });
                  values.blur = $('input[name=blur]:checked').val();
                  values.method = "dropbox";
                  values.name = files[0].name;
                  values.link = files[0].link;
                  $.ajax({ 
                    type: 'POST',
                    url: 'upload.php', // This is a URL on your website.
                    dataType: 'JSON',
                    
                    data: values,
                    success: function(res, status){

                    }
                  });
                  


 
          $("#dbintro").text("Thank you!");
              },
              cancel: function(){
                  console.log("awww");
                  //no file selected
              }
        });
     });

$(function() {
            $('#tabs').tabs().addClass('ui-tabs-vertical ui-helper-clearfix').toggle();
        });
});


/* persona block
Rashomon = {};
Rashomon.loggedIn = function(){
    $("#upload").toggle();
    $("#auth").toggle();
};
*/




var DndUpload = function (inputElem) {
    this.input = inputElem;
    this.dropZone = null;
    this.isDragging = false;
    this.init();
};

DndUpload.prototype.init = function () {
    this.buildDropZone();
};

DndUpload.prototype.buildDropZone = function () {
    var self = this,
        textDropZone;
    this.input.style.display = 'none';
    this.dropZone = document.createElement('div');
    this.dropZone.setAttribute('id', 'drop-zone');
    textDropZone = document.createElement('p');
    textDropZone.setAttribute('id', 'drop-text');
    textDropZone.appendChild(document.createTextNode('Drop files here!'));
    this.dropZone.appendChild(textDropZone);
    this.input.parentNode.appendChild(this.dropZone);
    document.getElementById('uploadSelect').addEventListener("change", this.parseBrowse, false);

    this.dropZone.addEventListener('dragover', this.handleDragOver, false);
    this.dropZone.addEventListener('dragenter', function (e) {
        self.handleDragEnter.call(self, e);
    }, false);
    this.dropZone.addEventListener('drop', function (e) {
        self.handleDrop.call(self, e);
    }, false);

    this.dropZone.addEventListener('dragleave', function (e) {
        self.handleDragLeave.call(self, e);
    }, false);
};

DndUpload.prototype.parseBrowse = function (e) {

    var files = e.target.files;
    var dropZone = document.getElementById('drop-zone');
    dropZone.className = '';

    var elem = document.getElementById('drop-text');
    if (elem) {
        dropZone.removeChild(elem);
    }
    for (var i = 0, len = files.length; i < len; i++) {
        fileUpload = new FileUpload(dropZone, files[i]);
    }

    return false;
    //e.preventDefault();
};

DndUpload.prototype.handleDragOver = function (e) {
    e.preventDefault();
};

DndUpload.prototype.handleDragEnter = function (e) {
    e.preventDefault();
    this.isDragging = true;
    this.dropZone.className = 'active';
};

DndUpload.prototype.handleDragLeave = function (e) {
    e.preventDefault();
    var target = e.target,
        parentElem = target.parentNode,
        flag = false;

    if (target !== this.dropZone) {
        while (parentElem.nodeType !== 9) {
            if (parentElem === this.dropZone) {
                flag = true;
                break;
            }
            parentElem = parentElem.parentNode;
        }
    } else {
        if (!flag) {
            this.isDragging = false;
            this.dropZone.className = '';
        }
    }
};

DndUpload.prototype.handleDrop = function (e) {
    e.preventDefault();
    var elem, files, fileUpload;
    this.dropZone.className = '';

    elem = document.getElementById('drop-text');
    if (elem) {
        this.dropZone.removeChild(elem);
    }
    files = e.dataTransfer.files;
    for (var i = 0, len = files.length; i < len; i++) {
        fileUpload = new FileUpload(this.dropZone, files[i]);
    }

    return false;
};


/*--------------------------------*/

var FileUpload = function (domAttach, file) {
    this.file = file;
    this.fileSizeMax = 167772160;
    this.attachDropZone = domAttach;
    this.xhr = null;
    this.progressBarPercent = null;
    this.progressPercentData = null;
    this.hasFormData = null;
    this.hasFileReader = null;
    this.fileMetaDiv = null;
    this.wrapperUploader = null;
    this.progressBar = null;
    this.btnCancel = null;
    this.patternImage = new RegExp('^image/*');
    this.init();
};

FileUpload.prototype.init = function () {

    try {
        new FormData();
        this.hasFormData = true;
    } catch (e) {
        this.hasFormData = false;
    }

    try {
        new FileReader();
        this.hasFileReader = true;
    } catch (e) {
        this.hasFileReader = false;
    }

    this.buildUploader();
    this.triggerUpload();
};

FileUpload.prototype.buildUploader = function () {
    var self = this;
    //container
    this.wrapperUploader = document.createElement('div');
    this.wrapperUploader.setAttribute('class', 'uploader');

    //contentZone
    this.fileMetaDiv = document.createElement('div');
    this.fileMetaDiv.setAttribute('class', 'file-metas');

    var fileName = document.createElement('div');
    fileName.setAttribute('class', 'file-name');
    fileName.appendChild(document.createTextNode(this.file.name));

    var fileSize = document.createElement('span');
    fileSize.setAttribute('class', 'file-size');
    fileSize.appendChild(document.createTextNode(this.getConvertSize(this.file.size)));

    fileName.appendChild(fileSize);

    //progress Bar
    this.progressBar = document.createElement('div');
    this.progressBar.setAttribute('class', 'progress-bar');

    this.progressBarPercent = document.createElement('div');
    this.progressBarPercent.setAttribute('class', 'progress-bar-uploaded');
    this.progressBarPercent.style.width = 0;
    /*this.progressBarPercent = document.createElement('progress');
   this.progressBarPercent.setAttribute('class', 'progress-bar-uploaded');
   this.progressBarPercent.setAttribute('max', '100');
   this.progressBarPercent.value = '0';*/

    this.progressBar.appendChild(this.progressBarPercent);

    this.progressPercentData = document.createElement('span');
    this.progressPercentData.setAttribute('class', 'progress-percent');

    this.fileMetaDiv.appendChild(fileName);
    this.fileMetaDiv.appendChild(this.progressBar);
    this.fileMetaDiv.appendChild(this.progressPercentData);

    this.wrapperUploader.appendChild(this.fileMetaDiv);


    //test if file is an image
    if (this.isImageFile() && this.hasFileReader) {
        this.createPreview();
    }


    //btn cancel
    this.btnCancel = document.createElement('a');
    this.btnCancel.setAttribute('class', 'btn-cancel');
    this.btnCancel.setAttribute('href', '#');
    this.btnCancel.appendChild(document.createTextNode('Cancel'));
    this.btnCancel.addEventListener('click', function (e) {
        self.cancelUpload.call(self, e);
    }, false);
    this.fileMetaDiv.appendChild(this.btnCancel);

    this.attachDropZone.appendChild(this.wrapperUploader);
};

FileUpload.prototype.cancelUpload = function (e) {
    e.preventDefault();
    if (this.xhr) {
        this.endProcess(0);
    }
};

FileUpload.prototype.getConvertSize = function (fileSize) {
    var test = fileSize,
        unitKey = 0,
        convert = null,
        result = null,
        unit = ['octets', 'K', 'M', 'G', 'T', 'P'];

    while ((test / 1024) >= 1) {
        convert = test = test / 1024;

        unitKey++;
    }
    result = Math.round(convert * 100) / 100;

    return (result + unit[unitKey]);
};

FileUpload.prototype.isImageFile = function () {
    return (this.file.type.match(this.patternImage)) ? true : false;
};

FileUpload.prototype.createPreview = function () {
    var self = this;
    var reader = new FileReader(),
        dataUrl = reader.readAsDataURL(this.file);

    reader.onloadend = function (e) {
        var result = e.target.result;

        if (result !== null) {
            var previewWrap = document.createElement('div');
            previewWrap.setAttribute('class', 'file-preview');

            var imgPreview = document.createElement('img');
            imgPreview.setAttribute('src', result);
            imgPreview.setAttribute('alt', '');

            previewWrap.appendChild(imgPreview);
            self.wrapperUploader.insertBefore(previewWrap, self.fileMetaDiv);
        }
    };
};

FileUpload.prototype.triggerUpload = function () {
    if (this.file.size < this.fileSizeMax) {
        if (this.hasFormData) {
            this.uploadWithFormData();
        } else {
            if (this.hasFileReader) {
                this.uploadWithFileReader();
            } else {
                console.log('no support');
            }
        }
    } else {
        this.endProcess(2);
    }
};

FileUpload.prototype.uploadWithFormData = function () {
    var data = new FormData();
    data.append('file', this.file);
    $(".ask").each(function (key, item) {
        data.append($(item).attr('name'), $(item).val());
    });
    //data.append('assertion', auth.assertion);
    data.append("blur", $('input[name=blur]:checked').val());
    this.sendDatas(data);
};

FileUpload.prototype.uploadWithFileReader = function () {
    var self = this;
    var reader = new FileReader();
    reader.onload = function (e) {
        var bin = e.target.result;
        if (bin !== null) {
            self.sendDatas(bin, true);
        }
    };
    reader.readAsBinaryString(this.file);
};

FileUpload.prototype.sendDatas = function (fileDatas) {
    var self = this;
    this.xhr = new XMLHttpRequest();

    if (this.xhr) {
        this.xhr.upload.addEventListener("progress", function (e) {
            self.updateProgress.call(self, e);
        }, false);
        this.xhr.addEventListener("load", function () {
            self.endUpload.call(self);
        }, false);
        this.xhr.addEventListener("abort", function () {
            self.closeXhr(self);
        }, false);
        document.body.addEventListener('offline', function () {
            self.endProcess(0);
        }, false);

        this.xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                var status = this.status;

                if (status === 200) {
                    self.endProcess(1);
                }
                if (status === 404 || status === 500) {
                    self.endProcess(0);
                }
                if (status === 415) {
                    self.endProcess(2);
                }
            }
        };
        this.xhr.open("POST", "upload.php");
        this.processUpload(fileDatas);
    }
};

FileUpload.prototype.processUpload = function (fileDatas) {
    if (this.hasFormData) {
        this.xhr.send(fileDatas);
    } else {
        if (this.hasFileReader) {

            var boundary = 'xxxxxx';
            this.xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary); // simulate a file MIME POST request.
            var body = "--" + boundary + "\r\n";
            body += "Content-Disposition: form-data; name='file'; filename='" + this.file.fileName + "'\r\n";
            body += "Content-Type:" + this.file.type + "\r\n\r\n";
            body += fileDatas + "\r\n";
            body += "--" + boundary + "--";

            this.xhr.sendAsBinary(body);
        }
    }
};

FileUpload.prototype.updateProgress = function (e) {
    if (e.lengthComputable) {
        var currentState = (e.loaded / e.total) * 100;

        this.progressPercentData.innerHTML = Math.ceil(currentState) + '%';
        this.progressBarPercent.style.width = currentState + "%";
        //this.progressBarPercent.value = currentState;
    }
};

FileUpload.prototype.endUpload = function () {
    this.progressPercentData.innerHTML = '100 %';
    this.progressBarPercent.style.width = '100%';
};

FileUpload.prototype.endProcess = function (control) {
    var self = this,
        cls = 'state',
        textResponse = null;

    this.fileMetaDiv.removeChild(this.progressPercentData);
    this.fileMetaDiv.removeChild(this.progressBar);
    this.fileMetaDiv.removeChild(this.btnCancel);
    var successFeedback = document.createElement('p');

    switch (control) {
        case 0:
            cls += ' state-error';
            textResponse = 'Canceled';
            break;
        case 1:
            cls += ' state-success';
            textResponse = 'Success';
            break;
        case 2:
            cls += ' bad-format';
            textResponse = "Unsupported Format";
            break;

    }

    successFeedback.setAttribute('class', cls);
    successFeedback.appendChild(document.createTextNode(textResponse));
    this.fileMetaDiv.appendChild(successFeedback);

    if (this.xhr) {
        this.xhr.abort();
    }

};

FileUpload.prototype.closeXhr = function () {
    this.xhr = null;
};

var dnd = {
    init: function () {
        var multiUpload = new DndUpload(document.querySelector('#multi-upload'));
    }
};

window.addEventListener('load', dnd.init, false);