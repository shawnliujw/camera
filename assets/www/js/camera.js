function onDeviceReady() {
		pictureSource = navigator.camera.PictureSourceType;
		destinationType = navigator.camera.DestinationType;
		
		$('#send').bind('click', function () {
			alert('Phone: ' + $('#phone').val() + ' Message: ' + $('#message').val());
			window.plugins.sms.send($('#phone').val(), 
                $('#message').val(), 
                function () { 
				   alert('Message sent successfully');	
			    },
				function (e) {
					alert('Message Failed:' + e);
				}
			);
		});  
		$("#testButton").trigger("click");
	}

	

	// Called when a photo is successfully retrieved
	//
	function onPhotoURISuccess(imageURI) {
		addPhotoToGallery(imageURI);
	}
	
	function addPhotoToGallery(src) {
		
		$("#uploadSuccessDiv").hide();
		saveUploadPhoto(src);
		var li = '<li><a href="#"><img src="'+src+'" alt="Image 002" /></a></li>';
		$("#galleryPage .gallery").prepend($(li));
	}

	// A button will call this function
	//
	function capturePhoto() {
		navigator.camera.getPicture(onPhotoURISuccess, onFail, {
			quality : 70, 
			  destinationType : Camera.DestinationType.FILE_URL, 
			  sourceType : Camera.PictureSourceType.CAMERA, 
			  encodingType: Camera.EncodingType.JPEG,
			  targetWidth: 1200
		});
	}


	//
	function getPhoto(source) {
		// Retrieve image file location from specified source
		navigator.camera.getPicture(onPhotoURISuccess, onFail, {
			quality : 70,
			destinationType : destinationType.FILE_URI,
			sourceType : source,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 1200
		});
	}

	// Called if something bad happens.
	// 
	function onFail(message) {
		alert('Failed because: ' + message);
	}


	/*     upload file            */

	function uploadPhoto() {
		$.mobile.showPageLoadingMsg();
		
		
		var folderName = (new Date()).getTime();
		$("#accessLink").attr("href",serverPath+"/"+folderName);
		$("#message").text(serverPath+"/"+folderName);
		var length = $("#galleryDiv img").length;
		$("#galleryDiv img").each(function(index,item){
			var imageURI = $(item).attr("src");
			var options = new FileUploadOptions();
			options.fileKey = "file1";
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";
			
			var params = new Object();
			params.folderName = folderName;
			//params.value2 = "param";
			options.params = params;
			
			var ft = new FileTransfer();
			
			if(index < length -1) {
				ft.upload(imageURI, serverPath + "/upload.do",
						"", fail, options);
			} else {
				
				ft.upload(imageURI,serverPath + "/upload.do",
						win, fail, options);
			}
		});
		
		//$("#accessLink").show();
	}

	/**
	*上传照片成功后
	*/
	function win(r) {
		$.mobile.hidePageLoadingMsg();
		alert("Upload photos successful!");
		$("#galleryDiv").empty();
		$("#uploadSuccessDiv").show();
		//$("#accessLink").show();
		//$("#sendSmsDiv").show();
		//$("#submitButton").hide();
		
		console.log("Code = " + r.responseCode);
		console.log("Response = " + r.response);
		console.log("Sent = " + r.bytesSent);
	}

	function fail(error) {
		$.mobile.hidePageLoadingMsg();
		alert("An error has occurred: Code = " + error.code);
		console.log("upload error source " + error.source);
		console.log("upload error target " + error.target);
	}
	function saveUploadPhoto(src) {
		localStorage.setItem("imaArray",src);
	}
	
