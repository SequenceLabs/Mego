(function() {

  modules = Namespace('SEQ.modules');

  modules.FlickrGallery = function(options){

  //EventDispatcher.js;
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  var EventDispatcher = function(){
  	this.eventHashTable = {};
  }

  EventDispatcher.prototype.addEventListener = function(eventType,func){
  	if(this.eventHashTable[eventType] === undefined) this.eventHashTable[eventType] = [];
  	if(this.eventHashTable[eventType].indexOf(func) === -1) this.eventHashTable[eventType].push(func);
  };

  EventDispatcher.prototype.removeEventListener = function(eventType,func){
  	if(this.eventHashTable[eventType] === undefined) return false;
  	if(this.eventHashTable[eventType].indexOf(func) > -1) this.eventHashTable[eventType].splice(this.eventHashTable[eventType].indexOf(func),1);
  	return true;
  };

  Array.prototype.indexOf = function(value){
  	for(var i=0;i<this.length;i++){
  		if(this[i] === value){
  			return i;
  		}
  	}
  	return -1;
  }

  EventDispatcher.prototype.dispatchEvent = function(eventObject){
  	var a = this.eventHashTable[eventObject.eventType];
  	if(a === undefined || a.constructor != Array){
  		return false;
  	}
  	for(var i=0;i<a.length;i++){
  		a[i](eventObject);
  	}
  };
  //end of EventDispatcher.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________








  //FlickrGalleryImage.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  var FlickrGalleryImage = function(){
  	//Inheritance
  	EventDispatcher.call(this);
  	this.self = this;

  	//Public Constants
  	this.LOAD_STATUS_NONE = 0;
  	this.LOAD_STATUS_LOADING = 1;
  	this.LOAD_STATUS_LOADED = 2;
  	this.LOAD_STATUS_ERROR = 3;

  	//Private Class Properties
  	this._imageElement;
  	this._src;
  	this._loadStatus = this.LOAD_STATUS_NONE;

  	this.init();
  }
  FlickrGalleryImage.prototype = new EventDispatcher();






  //PRIVATE
  //____________________________________________________________________
  FlickrGalleryImage.prototype.init = function(){
  	this._imageElement = new Image();
  	this._imageElement.onload = this.imageLoadComplete.context(this);
  	this._imageElement.onabort = this.imageLoadError.context(this);
  	this._imageElement.onerror = this.imageLoadError.context(this);
  	this._loadStatus = this.LOAD_STATUS_NONE;
  }

  FlickrGalleryImage.prototype.imageLoadComplete = function(e){
  	this._loadStatus = this.LOAD_STATUS_LOADED;
  	this.dispatchEvent(new FlickrGalleryImageEvent("complete",this));
  };

  FlickrGalleryImage.prototype.imageLoadError = function(e){
  	this._loadStatus = this.LOAD_STATUS_ERROR;
  	this.dispatchEvent(new FlickrGalleryImageEvent("imageLoadError",this));
  };







  //PUBILC
  //______________________________________________________________________
  FlickrGalleryImage.prototype.getImage = function(){
  	return this._imageElement;
  };

  FlickrGalleryImage.prototype.setSrc = function(str){
  	if(this._src !== str || this._loadStatus === this.LOAD_STATUS_NONE){
  		this._loadStatus = this.LOAD_STATUS_LOADING;
  		this._imageElement.src = str;
  		this._src = str;
  	}
  };

  FlickrGalleryImage.prototype.getSrc = function(){
  	return this._imageElement.src;
  };

  FlickrGalleryImage.prototype.getLoadStatus = function(){
  	return this._loadStatus;
  };





  //Gallery Image Event
  var FlickrGalleryImageEvent = function(eventType,galleryImage){
  	this.eventType = eventType; 
  	this.galleryImage = galleryImage;
  };
  //end of FlickrGalleryImage.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________





  //FlickrGalleryDataManager.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________

  var FlickrGalleryDataManager = function(options) {
      //Inheritance
      EventDispatcher.call(this);
      this.self = this;

      this._apiKey = options.apiKey;
      this._userId = options.userId;
      this._photoSetId = options.photoSetId || "";
      this._thumbsMaxPerPage = options.thumbsPerPage;
      this._thumbPageIndex = -1;
      this._photoData;
      this._page = 1;
      this._dataItemsPerPage = 500; 				//JSON Data
      this._totalPhotos;
      this._selectedImageIndex = -1;
      this._loadFlickrJSONActive = false;
      this._loadFlickrJSONPage = 1;


      this.init();
  }
  //Inheritance
  FlickrGalleryDataManager.prototype = new EventDispatcher();




  //PRIVATE
  //____________________________________________________________________________________________________
  FlickrGalleryDataManager.prototype.init = function() {

  };

  FlickrGalleryDataManager.prototype.onLoadFlickrJSONSucess = function(data) {
      //console.log("DataManager onLoadFlickrJSONSucess()");
      if (this._photoData == undefined) {
          if (this._photoSetId == "") {
              this._photoData = data.photos.photo;
              this._totalPhotos = parseInt(data.photos.total);
          } else {
              this._photoData = data.photoset.photo;
              this._totalPhotos = parseInt(data.photoset.total);
          }
          this.loadInitialImage();
      } else {
          if (this._photoSetId == "") {
              this._photoData = this._photoData.concat(data.photos.photo);
          } else {
              this._photoData = this._photoData.concat(data.photoset.photo);
          }

      }
      this.dispatchEvent(new FlickrGalleryDataManagerEvent('loadingDataComplete'));
  };

  FlickrGalleryDataManager.prototype.loadInitialImage = function() {
      //console.log("DataManager loadInitialImage()");
      var flickrGalleryImage = new FlickrGalleryImage();
      var imageObject = this.getImageObjectByIndex(0);
      imageObject.previewImageObject = flickrGalleryImage;
      flickrGalleryImage.addEventListener('complete', this.onInitialImageLoadCompleteHandler.context(this));
      //flickrGalleryImage.setSrc(this.getImageSrcByImageObject(imageObject,"_b"));
      this.setSelectedIndex(0);

      var self = this;
      //var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key='  + this._apiKey + '&photo_id=' + imageObject.id + '&format=json&nojsoncallback=1';
      var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=' + this._apiKey + '&photo_id=' + imageObject.id + '&format=json&jsoncallback=?';
      $.getJSON(url, function(data) {
          //console.log("DataManager loadInitialImage() getJSON complete");
          var i = data.sizes.size.pop();
          var largestSizeSource = i.source;
          flickrGalleryImage.setSrc(largestSizeSource);
      });

  };
  FlickrGalleryDataManager.prototype.onInitialImageSizesLoadCompleteHandler = function(e) {
      //console.log("DataManager onInitialImageSizesLoadCompleteHandler()");

  }


  FlickrGalleryDataManager.prototype.onInitialImageLoadCompleteHandler = function(e) {
      //console.log("DataManager onInitialImageLoadCompleteHandler()");

  }

  FlickrGalleryDataManager.prototype.preloadPreviewImage = function(index) {
      if (index < this._totalPhotos) {
          if (index < this._photoData.length) {
              /*
              var flickrGalleryImage = new FlickrGalleryImage();
              var imageObject = this.getImageObjectByIndex(index);
              imageObject.previewImageObject = flickrGalleryImage;
              flickrGalleryImage.addEventListener('complete',this.onPreloadPreviewImageLoadCompleteHandler.context(this));
              flickrGalleryImage.setSrc(this.getImageSrcByImageObject(imageObject,""));
              */
              /*
              var previewImageObject = dataManager.getPreviewImageObjectForIndex(index);
              var loadStatus = previewImageObject.getLoadStatus();
              switch(loadStatus){
              case previewImageObject.LOAD_STATUS_NONE:
              previewImageObject.addEventListener('complete',this.onPreloadPreviewImageLoadCompleteHandler.context(this));	//listen to the load
              previewImageObject.setSrc(this.getImageSrcByImageObject(this.getImageObjectByIndex(index),"_b"));					//intiate the load
              break;
              case previewImageObject.LOAD_STATUS_LOADING:
              previewImageObject.addEventListener('complete',this.onPreloadPreviewImageLoadCompleteHandler.context(this));	//listen to the load
              break;
              case previewImageObject.LOAD_STATUS_LOADED:
              break;
              case previewImageObject.LOAD_STATUS_ERROR:
              break;
              }
              */


              var imageObject = this.getImageObjectByIndex(index);
              var self = this;
              var url = 'http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=' + this._apiKey + '&photo_id=' + imageObject.id + '&format=json&jsoncallback=?'

              $.getJSON(url, function(data) {
                  //console.log("Preview Image Size Load"+data);
                  //console.log("Preview Image Index:"+index +" url:"+url+" Size Load"+data);
                  var i = data.sizes.size.pop();
                  var largestSizeSource = i.source;

                  var previewImageObject = self.getPreviewImageObjectForIndex(index);
                  var loadStatus = previewImageObject.getLoadStatus();
                  switch (loadStatus) {
                      case previewImageObject.LOAD_STATUS_NONE:
                          //previewImageObject.addEventListener('complete',self.onPreloadPreviewImageLoadCompleteHandler.context(self));	//listen to the load
                          previewImageObject.setSrc(largestSizeSource); 																//intiate the load
                          break;
                      case previewImageObject.LOAD_STATUS_LOADING:
                          //previewImageObject.addEventListener('complete',self.onPreloadPreviewImageLoadCompleteHandler.context(self));	//listen to the load
                          break;
                      case previewImageObject.LOAD_STATUS_LOADED:
                          break;
                      case previewImageObject.LOAD_STATUS_ERROR:
                          break;
                  }


              });


          } else {
              //console.log("Need to load more photo data from flickr api so we can preload the next image");	
          }
      }
  }

  FlickrGalleryDataManager.prototype.onPreloadPreviewImageLoadCompleteHandler = function(flickrGalleryImageEvent) {
      var src = flickrGalleryImageEvent.galleryImage.getSrc();
      ////console.log("Prelaoded Preview Image:"+src);
  }




  //PUBLIC
  //_______________________________________________________________________________________________
  /*
  * @description called to initiate the loading of Flickr JSON Data
  */
  FlickrGalleryDataManager.prototype.load = function() {
      //console.log("DataManager load()");
      if (this._photoSetId == "") {
          $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=' + this._apiKey + '&user_id=' + this._userId + '&format=json&per_page=' + this._dataItemsPerPage + '&page=' + this._loadFlickrJSONPage + '&jsoncallback=?', this.onLoadFlickrJSONSucess.context(this));
      } else {
          $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + this._apiKey + '&photoset_id=' + this._photoSetId + '&user_id=' + this._userId + '&format=json&per_page=' + this._dataItemsPerPage + '&page=' + this._loadFlickrJSONPage + '&jsoncallback=?', this.onLoadFlickrJSONSucess.context(this));
      }

      //TODO
      //Get the next page of data
      //set page to 1 and load
      //load complete method to top up data

      /*
      determin when we need to load another round of data
      this is determined by how many thumbPages we can fit in to the data.

  	this._thumbsMaxPerPage 

  	load next data when entering the second but last thumb page.


  	50/ 19 = 2.6; floor = 2; -1 to get index; 
      Math.floor(this._photoData.length / this._thumbsMaxPerPage)

  	hhhmmmmmmm need to work on this
      */
      //RULES
      //upon first enter the last by two pages, load the next XML
      /*
      while loading remove interactivity while loading
      pause playback to stop update selected







  	*/

  };

  /*
  * @description get the imageObject with index, index is used as main identifier of current selection
  */
  FlickrGalleryDataManager.prototype.getImageObjectByIndex = function(index) {
      return this._photoData[index];
  };

  /*
  * @description method to construct the image url for you
  */
  FlickrGalleryDataManager.prototype.getImageSrcByImageObject = function(imageObject, size) {
      return 'http://farm' + imageObject.farm + '.static.flickr.com/' + imageObject.server + '/' + imageObject.id + '_' + imageObject.secret + size + '.jpg';
  }

  /*
  * @description set the selectedIndex
  */
  FlickrGalleryDataManager.prototype.setSelectedIndex = function(index) {
      if (index >= this._totalPhotos) {
          index = 0;
      } else if (index < 0) {
          index = this._totalPhotos - 1;
      }
      this.preloadPreviewImage(index + 1);
      this._selectedImageIndex = index;
      this.dispatchEvent(new FlickrGalleryDataManagerEvent('updateSelected', index));


      //check to see if we need to load more flickr data
      var thumbPageRange = this.getThumbPageRange();
      var loadedPagesLength = this.getLoadPagesLength();
      if (this._photoData.length < this._totalPhotos) {										//chec if we need to load more data
          if (loadedPagesLength > 1 && thumbPageRange.pageIndex === loadedPagesLength - 2) {	//check if second but last page
              if (index === thumbPageRange.endIndex) {										//check if last page
                  this._loadFlickrJSONActive = true;
                  this._loadFlickrJSONPage++;
                  //console.log("Load JSON Page:"+this._loadFlickrJSONPage);
                  this.dispatchEvent(new FlickrGalleryDataManagerEvent('loadingData', index));

                  if (this._photoSetId == "") {
                      $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=' + this._apiKey + '&user_id=' + this._userId + '&format=json&per_page=' + this._dataItemsPerPage + '&page=' + this._loadFlickrJSONPage + '&jsoncallback=?', this.onLoadFlickrJSONSucess.context(this));
                  } else {
                      $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' + this._apiKey + '&photoset_id=' + this._photoSetId + '&user_id=' + this._userId + '&format=json&per_page=' + this._dataItemsPerPage + '&page=' + this._loadFlickrJSONPage + '&jsoncallback=?', this.onLoadFlickrJSONSucess.context(this));
                  }
              }
          }
      }

  }

  /*
  * @description returns the currente selectedIndex
  */
  FlickrGalleryDataManager.prototype.getSelectedIndex = function() {
      return this._selectedImageIndex;
  }


  FlickrGalleryDataManager.prototype.getPreviewImageObjectForIndex = function(index) {
      var imageObject = this.getImageObjectByIndex(index);
      if (imageObject.previewImageObject == undefined) {
          imageObject.previewImageObject = new FlickrGalleryImage();
      }
      return imageObject.previewImageObject;
  }

  FlickrGalleryDataManager.prototype.getThumbImageObjectForIndex = function(index) {
      var imageObject = this.getImageObjectByIndex(index);
      if (imageObject.thumbImageObject == undefined) {
          imageObject.thumbImageObject = new FlickrGalleryImage();
      }
      return imageObject.previewImageObject;
  }

  FlickrGalleryDataManager.prototype.getLoadPagesLength = function() {
      return Math.ceil(this._photoData.length / this._thumbsMaxPerPage);
  }

  FlickrGalleryDataManager.prototype.getThumbPageRange = function() {
      var pageIndex = Math.floor(this._selectedImageIndex / this._thumbsMaxPerPage);
      var startIndex = pageIndex * this._thumbsMaxPerPage;
      var endIndex = (startIndex + this._thumbsMaxPerPage >= this._totalPhotos) ? this._totalPhotos - 1 : startIndex + this._thumbsMaxPerPage - 1;
      var pageLength = Math.ceil(this._totalPhotos / this._thumbsMaxPerPage);
      return { startIndex: startIndex, endIndex: endIndex, pageIndex: pageIndex, pageLength: pageLength };
  }

  FlickrGalleryDataManager.prototype.getSelectedThumbPageIndex = function() {
      return this._selectedImageIndex - this.getThumbPageRange().startIndex;
  }




  //Event Classes
  //_________________________________________________________________________________________	
  var FlickrGalleryDataManagerEvent = function(eventType, index) {
      this.eventType = eventType;
      this.index = index;
  };
  //end of FlickrGalleryDataManager.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________






  //FlickrGalleryPreviewViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  var FlickrGalleryPreviewViewController = function(flickrGallery){
  	//Inheritance
  	EventDispatcher.call(this);
  	this.self = this;

  	this.MODE_WAITING_FOR_PRELOAD = 0;
  	this.MODE_PLAYING = 1;
  	this.MODE_TRANSITIONING = 2;
  	this.MODE_NOT_PLAYING = 3;

  	this._dataManager = flickrGallery.getDataManager();
  	this._flickGallery = flickrGallery;
  	this._previewView;
  	this._playTimeout;
  	this._playTimeoutAmount = 5000;
  	this._transitionTimeAmmount = 500;
  	this._mode;
  	this._currentImage;
  	this._previousImage;
  	this._waitingImageObject;
  	this._isPlaying = true;
  	this._savedPlayMode;
  	this._element = undefined;
  	this.init();
  };
  //Inheritance
  FlickrGalleryPreviewViewController.prototype = new EventDispatcher();



  FlickrGalleryPreviewViewController.prototype.init = function(){
  	this.build();
  	this._dataManager.addEventListener('updateSelected',this.onUpdateSelected.context(this));
  	this._dataManager.addEventListener('loadData',this.onLoadData.context(this));
  	this._dataManager.addEventListener('loadDataComplete',this.onLoadDataComplete.context(this));
  	if(this._flickGallery.getClickPreviewToLinkMode()){
  	    $(this._element).bind("click",this.onPreviewClick.context(this));
  	}
  };



  FlickrGalleryPreviewViewController.prototype.onLoadData = function(dataManagerEvent){
  	this._savedPlayMode = this._isPlaying;
  	this.play(false);
  };

  FlickrGalleryPreviewViewController.prototype.onLoadDataComplete = function(dataManagerEvent){
  	this.play(this._savedPlayMode);
  };



  /*
  * @description event handler called from dataManager when selection is updated.
  */
  FlickrGalleryPreviewViewController.prototype.onUpdateSelected = function(dataManagerEvent){
  	//remove timeouts that are running, this can happen if the dataManager updates within a playing cycle
  	if(this._playTimeout!=undefined){
  		clearTimeout(this._playTimeout);
  		this._playTimeout = undefined;
  	}

  	if(this._mode === this.MODE_TRANSITIONING){
  		//if we are in the middle of a transition then stop fade and remove the previous, forcing the transition to end
  		$(this._currentImage).stop(true, false);
  		//remove previous
  		if(this._previousImage != undefined){
  			//console.log("onUpdateSelected() Remove Previous Image mid fade:"+this._previousImage.id);
  			$(this._previousImage).stop(true,false);
  			remove(this._previousImage);
  			this._previousImage = undefined;		
  		}
  	}

  	var index = dataManagerEvent.index;
  	var previewImageObject = this._dataManager.getPreviewImageObjectForIndex(index);
  	var loadStatus = previewImageObject.getLoadStatus();
  	if(loadStatus === previewImageObject.LOAD_STATUS_NONE || loadStatus === previewImageObject.LOAD_STATUS_LOADING){
  		////console.log("Image is loading..."+loadStatus);
  		this.dispatchEvent(new FlickrGalleryPreviewViewControllerEvent("loading"));													//dispatch event so loadingViewController can give feedback to use											
  		this._mode = this.MODE_WAITING_FOR_PRELOAD;	
  		//console.log("MODE_WAITING_FOR_PRELOAD");																				//set mode, used in class to accertain state
  		this._waitingImageObject = previewImageObject;																				//save imageObject into property in order to be able to removeEventListener later if need be
  		//previewImageObject.addEventListener("complete",this.initSnapToCurrentImage.rEvtContext(this));								//listen to the load
  		previewImageObject.addEventListener("complete",this.initFadeToCurrentImage.rEvtContext(this));								//listen to the load
  		/*
  		previewImageObject.setSrc(this._dataManager.getImageSrcByImageObject(this._dataManager.getImageObjectByIndex(index),""));	
  		*/
  		/*
  		//intiate the load, this will happen usually because if the user clicks on the thumb this will update the selected ordering the data manager to preload the next item, but the current item may not and probably wont be loaded
  		//so check if ever been loaded, if not tell datamanager to load. Listener has been added above.
  		*/
  		if(loadStatus === previewImageObject.LOAD_STATUS_NONE){			
  			this._dataManager.preloadPreviewImage(index);
  		}
  	}else if(loadStatus === previewImageObject.LOAD_STATUS_LOADED){
  		////console.log("onUpdateSelected Image is loaded "+loadStatus);
  		//this.initSnapToCurrentImage();
  		this.initFadeToCurrentImage();
  	}
  };
  
  FlickrGalleryPreviewViewController.prototype.onPreviewClick = function(e){
   	var index = this._flickGallery.getDataManager().getSelectedIndex();
   	var imageObject = this._flickGallery.getDataManager().getImageObjectByIndex(index);
   	var userID = this._flickGallery.getUserID();
   	var url = "http://www.flickr.com/photos/" + userID + "/" + imageObject.id + "/";
   	document.location.href = url;
   	
   
  }

  /*
  * @description create the div container that will hold the images
  */
  FlickrGalleryPreviewViewController.prototype.build = function(){
  	var flickrGalleryContainer = this._flickGallery.getFlickrGalleryContainer();
  	var previewViewControllerElement = create('div');
  	this._element = previewViewControllerElement;
  	append(flickrGalleryContainer,previewViewControllerElement);
  	previewViewControllerElement.setAttribute('id',flickrGalleryContainer.id + "-previewView");
  	this._previewView = previewViewControllerElement;
  }


  /*
  * @description creates new image and appends to the dom, returns the imageElement.
  */
  FlickrGalleryPreviewViewController.prototype.createImage = function(imageIndex){
  	var imageObject;
  	var image;
  	var imageWidth;
  	var imageHeight;
  	var frameWidth;
  	var frameHeight;
  	var flickrGalleryContainer;
  	var frameRatio;
  	var imageRatio;
  	var imageScaledWidth;
  	var imageScaledHeight;

  	imageObject = this._dataManager.getImageObjectByIndex(imageIndex);
  	image = new Image();
  	image.src = imageObject.previewImageObject.getSrc();
  	//attr(image,"class",".flickrGallery-previewImage");
  	attr(image,"id",imageObject.id);
  	append(this._previewView,image);

  	imageWidth = image.width;
  	imageHeight = image.height;
  	imageRatio = imageWidth / imageHeight;
  	
  	//Use the preview-view div to calculate image size not the main gallery div
  	//flickrGalleryContainer = this._flickGallery.getFlickrGalleryContainer();
  	flickrGalleryContainer = $(this._element).get(0);
  	
  	frameWidth = flickrGalleryContainer.clientWidth;
  	frameHeight = flickrGalleryContainer.clientHeight;
  	frameRatio = frameWidth / frameHeight;

  	if(this._flickGallery.getScaleMode() === this._flickGallery.SCALE_TO_FIT){
  		if(imageRatio > frameRatio){	//calculate using width
  			imageScaledWidth = frameWidth;
  			imageScaledHeight = Math.round(imageHeight * (frameWidth / imageWidth))
  			image.style.width = imageScaledWidth +"px";
  			image.style.height = imageScaledHeight +"px";
  			image.style.left = "0px";
  			image.style.top = Math.round((frameHeight - imageScaledHeight) / 2) + "px";
  			image.style.maxWidth = frameWidth+"px";
  		}else{							//calculate using height
  			imageScaledWidth = Math.round(imageWidth * (frameHeight / imageHeight));
  			imageScaledHeight = frameHeight;
  			image.style.height = imageScaledHeight +"px";
  			image.style.width = imageScaledWidth +"px";
  			image.style.left = Math.round((frameWidth - imageScaledWidth)/2) +"px";
  			image.style.top = "0px";
  			image.style.maxWidth = frameWidth + "px";
  		}
  	}else{
  		if(imageRatio > frameRatio){	//calculate using height
  			imageScaledWidth = Math.round(imageWidth * (frameHeight / imageHeight));
  			imageScaledHeight = frameHeight;
  			image.style.height = imageScaledHeight +"px";
  			image.style.width = imageScaledWidth +"px";
  			image.style.left = Math.round((frameWidth - imageScaledWidth)/2) +"px"; 
  			image.style.top = "0px";
  		}else{							//calculate using width
  			imageScaledWidth = frameWidth;
  			imageScaledHeight = Math.round(imageHeight * (frameWidth / imageWidth))
  			image.style.width = imageScaledWidth +"px";
  			image.style.height = imageScaledHeight +"px";
  			image.style.left = "0px";
  			image.style.top = Math.round((frameHeight - imageScaledHeight)/2) +"px";
		
  		}
  	}

  	image.style.position = "absolute";

  	return image;
  };

  /*
  * @description instantly display the selected image
  *//*
  FlickrGalleryPreviewViewController.prototype.initSnapToCurrentImage = function(){
  	this.dispatchEvent(new FlickrGalleryPreviewViewControllerEvent("loaded"));

  	//remove loading
  	//console.log('initSnapToCurrentImage');
  	//remove any waiting listeners
  	if(this._waitingImageObject){
  		var result = this._waitingImageObject.removeEventListener("complete",this.initSnapToCurrentImage.rEvtContext(this));
  		this._waitingImageObject = undefined;
  	}

  	//remove previous
  	if(this._previousImage){
  		remove(this._previousImage);	
  	}

  	//remove current
  	if(this._currentImage){
  		remove(this._currentImage);	
  	}

  	var currentImageIndex = this._dataManager.getSelectedIndex();
  	this._currentImage = this.createImage(currentImageIndex);

  	//inititate the play timeout again if playing is on
  	if(this._isPlaying){
  		this._mode = this.MODE_PLAYING;
  		this._playTimeout = setTimeout(this.tryNextImage.context(this),this._playTimeoutAmount);
  	}else{
  		this._mode = this.MODE_NOT_PLAYING;
  	}
  };
  */

  FlickrGalleryPreviewViewController.prototype.initFadeToCurrentImage = function(){
  	////console.log("PreviewViewController initFadeToCurrentImage()");
  	this.dispatchEvent(new FlickrGalleryPreviewViewControllerEvent("loaded"));

  	//remove loading
  	//remove any waiting listeners
  	if(this._waitingImageObject){
  		var result = this._waitingImageObject.removeEventListener("complete",this.initFadeToCurrentImage.rEvtContext(this));
  		this._waitingImageObject = undefined;
  	}	

  	this._previousImage = this._currentImage;
  	$(this._previousImage).fadeOut(this._transitionTimeAmmount);

  	var currentImageIndex = this._dataManager.getSelectedIndex();
  	this._currentImage = this.createImage(currentImageIndex);

  	this._currentImage.style.display = "none";
  	$(this._currentImage).fadeIn(this._transitionTimeAmmount, this.endFadeToCurrentImage.context(this));
  	this._mode = this.MODE_TRANSITIONING;
  	//console.log("MODE_TRANSITIONING");
  }



  FlickrGalleryPreviewViewController.prototype.endFadeToCurrentImage = function(){
  	////console.log("PreviewViewController endFadeToCurrentImage()");
  	//remove previous
  	if(this._previousImage){
  		//console.log("endFadeToCurrentImage() Remove Previous Image After Fade:"+this._previousImage.id);
  		$(this._previousImage).stop(true,false);
  		remove(this._previousImage);
  		this._previousImage = undefined;	
  	}

  	//inititate the play timeout again if playing is on
  	if(this._isPlaying){
  		this._mode = this.MODE_PLAYING;
  		this._playTimeout = setTimeout(this.tryNextImage.context(this),this._playTimeoutAmount);
  		//console.log("MODE_PLAYING");
  	}else{
  		this._mode = this.MODE_NOT_PLAYING;
  		//console.log("MODE_NOT_PLAYING");
  	}
  }

  /*
  * @description timeout attempts to move to the next image
  */
  FlickrGalleryPreviewViewController.prototype.tryNextImage = function(){
  	this._dataManager.setSelectedIndex(this._dataManager.getSelectedIndex()+1);
  };




  //PUBLIC
  //________________________________________________________________________________________
  FlickrGalleryPreviewViewController.prototype.play = function(b){
  	this._isPlaying = b;
  	switch(this._mode){
  		case this.MODE_PLAYING:
  			if(this._playTimeout!=undefined){
  				clearTimeout(this._playTimeout);
  				this._playTimeout = undefined;
  			}
  			this._mode = this.MODE_NOT_PLAYING;
  			//console.log("MODE_NOT_PLAYING");	
  			break;
  		case this.MODE_NOT_PLAYING:
  			this._playTimeout = setTimeout(this.tryNextImage.context(this),this._playTimeoutAmount);
  			this._mode = this.MODE_PLAYING;
  			//console.log("MODE_PLAYING");	
  			break;
  		case this.MODE_WAITING_FOR_PRELOAD:
  			break;
  		case this.MODE_TRANSITIONING:
  			break;
  	}
  };

  FlickrGalleryPreviewViewController.prototype.getPlaying = function(){
  	return this._isPlaying;
  }


  //Event Classes
  //_________________________________________________________________________________________	
  var FlickrGalleryPreviewViewControllerEvent = function(eventType){
  	this.eventType = eventType;
  };
  //end of FlickrGalleryPreviewViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________








  //FlickrGalleryLoadingViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  // JavaScript Document
  var FlickrGalleryLoadingViewController = function(flickrGallery){
  	this._flickrGallery = flickrGallery;
  	this._loadingContainer;
  	this.init();
  };




  //PRIVATE
  //________________________________________________________________________________________________________
  FlickrGalleryLoadingViewController.prototype.init = function(){
  	this.build();
  	this._flickrGallery.getPreviewViewerController().addEventListener("loaded",this.hide.context(this));
  	this._flickrGallery.getPreviewViewerController().addEventListener("loading",this.show.context(this));
  };

  FlickrGalleryLoadingViewController.prototype.build = function(){
    //console.log(options);
  	this._loadingContainer = create('div');
  	this._loadingContainer.innerHTML = '<img class="flickrGallery-loadingIcon" src="'+options.loaderGifSrc+'"/>'
  	attr(this._loadingContainer, "class", "flickrGallery-loadingContainer flickrGallery-loaded");

  	this._flickrGallery.getFlickrGalleryContainer();
  	append(this._flickrGallery.getFlickrGalleryContainer(),this._loadingContainer);
  };

  FlickrGalleryLoadingViewController.prototype.hide = function(){
  	//attr(this._loadingContainer, "class", "flickrGallery-loadingContainer flickrGallery-loaded");
  	$(this._loadingContainer).fadeOut(500);
  }

  FlickrGalleryLoadingViewController.prototype.show = function(){
  	//attr(this._loadingContainer, "class", "flickrGallery-loadingContainer flickrGallery-loading");
  	$(this._loadingContainer).fadeIn(500);
  }
  //end of FlickrGalleryLoadingViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________







  //FlickrGalleryControlViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  // JavaScript Document
  var FlickrGalleryControlViewController = function(flickrGallery) {
      this._flickrGallery = flickrGallery;
      this._playPauseButton;
      this._leftButton;
      this._rightButton;
      this._controlsContainer;
      this._isPlaying = true;
      this.init();
  };

  FlickrGalleryControlViewController.prototype.init = function() {
      this.build();
      this._flickrGallery.getDataManager().addEventListener("loadingDataComplete", this.activate.context(this));
      this._flickrGallery.getDataManager().addEventListener("loadingData", this.deactivate.context(this));
  };

  FlickrGalleryControlViewController.prototype.build = function() {
      this._controlsContainer = create('div');
      attr(this._controlsContainer, "class", "flickrGallery-controlsContainer");
      append(this._flickrGallery.getFlickrGalleryContainer(), this._controlsContainer);

      this._leftButton = create('div');
      attr(this._leftButton, "class", "flickrGallery-leftButton");
      append(this._controlsContainer, this._leftButton);

      this._playPauseButton = create('div');
      attr(this._playPauseButton, "class", "flickrGallery-playPauseButton paused");
      append(this._controlsContainer, this._playPauseButton);

      this._rightButton = create('div');
      attr(this._rightButton, "class", "flickrGallery-rightButton");
      append(this._controlsContainer, this._rightButton);
  };

  FlickrGalleryControlViewController.prototype.activate = function() {
      //console.log("FlickrGalleryControlViewController activate()");
      addEvent(this._leftButton, "click", this.onLeftButtonClickHandler.rEvtContext(this));
      addEvent(this._playPauseButton, "click", this.onPlayPauseButtonClickHandler.rEvtContext(this));
      addEvent(this._rightButton, "click", this.onRightButtonClickHandler.rEvtContext(this));
  }

  FlickrGalleryControlViewController.prototype.deactivate = function() {
      //console.log("FlickrGalleryControlViewController deactivate()");
      removeEvent(this._leftButton, "click", this.onLeftButtonClickHandler.rEvtContext(this));
      removeEvent(this._playPauseButton, "click", this.onPlayPauseButtonClickHandler.rEvtContext(this));
      removeEvent(this._rightButton, "click", this.onRightButtonClickHandler.rEvtContext(this));
  }


  FlickrGalleryControlViewController.prototype.onPlayPauseButtonClickHandler = function() {
      if (this._isPlaying) {
          this._isPlaying = false;
          attr(this._playPauseButton, "class", "flickrGallery-playPauseButton playing");
      } else {
          this._isPlaying = true;
          attr(this._playPauseButton, "class", "flickrGallery-playPauseButton paused");
      }
      this._flickrGallery.getPreviewViewerController().play(this._isPlaying);
  };

  FlickrGalleryControlViewController.prototype.onLeftButtonClickHandler = function() {
      var dataManager = this._flickrGallery.getDataManager();
      dataManager.setSelectedIndex(dataManager.getSelectedIndex() - 1);
  };

  FlickrGalleryControlViewController.prototype.onRightButtonClickHandler = function() {
      var dataManager = this._flickrGallery.getDataManager();
      dataManager.setSelectedIndex(dataManager.getSelectedIndex() + 1);
  };


  //PUBLIC
  //__________________________________________________________________________________________________
  FlickrGalleryControlViewController.prototype.getControlsContainer = function() {
      return this._controlsContainer;
  }
  //end of FlickrGalleryControlViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________








  //end of FlickrGalleryThumbsViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  // JavaScript Document
  var FlickrGalleryThumbsViewController = function(flickrGallery){
  	//Inheritance
  	EventDispatcher.call(this);
  	this.self = this;

  	this._dataManager = flickrGallery.getDataManager();
  	this._flickrGallery = flickrGallery;
  	this._thumbsArray = [];
  	this._thumbPageRangeObject;
  	this._selectedIndex;
  	this._thumbsContainer;
  	this.init();
  };
  //Inheritance
  FlickrGalleryThumbsViewController.prototype = new EventDispatcher();



  //PRIVATE
  //________________________________________________________________________________________________________
  FlickrGalleryThumbsViewController.prototype.init = function(){
  	this.build();
  	this._dataManager.addEventListener('updateSelected',this.onUpdateSelected.context(this));
  };

  FlickrGalleryThumbsViewController.prototype.build = function(){
  	this._thumbsContainer = create('div');
  	attr(this._thumbsContainer, "class", "flickrGallery-thumbsContainer");
  	append(this._flickrGallery.getFlickrGalleryContainer(), this._thumbsContainer);
  	//Hack for IE to force width of thumbContainer so padding will take affect.
  	//NOTE JH: This needs to be refactored and less hacky
  	//var thumbContainerGutter = 0;//34;
  	//$(this._thumbsContainer).css("width", ($(this._flickrGallery.getFlickrGalleryContainer()).width() - thumbContainerGutter) + "px");
  };

  /*
  * @description event handler called from dataManager when selection is updated.
  */
  FlickrGalleryThumbsViewController.prototype.onUpdateSelected = function(dataManagerEvent){
  	var newSelectedIndex = dataManagerEvent.index;
  	var thumbPageRangeObject = this._dataManager.getThumbPageRange();
  	var previousSelectedThumb;
  	if(this._thumbPageRangeObject && thumbPageRangeObject.startIndex === this._thumbPageRangeObject.startIndex){
  		previousSelectedThumb = this._thumbsArray[this._selectedIndex];
  		attr(previousSelectedThumb, "class", "flickrGallery-thumb");
  	}else{
  		//console.log("New Thumb Page");
  		this.removeThumbs();
  		this.createThumbs();
  	}
  	var newSelectedIndex = this._dataManager.getSelectedThumbPageIndex();
  	attr(this._thumbsArray[newSelectedIndex], "class", "flickrGallery-thumb-selected");
  	this._selectedIndex = newSelectedIndex;
  };

  FlickrGalleryThumbsViewController.prototype.createThumbs = function(){
  	this._thumbPageRangeObject = this._dataManager.getThumbPageRange();
  	for(var index = this._thumbPageRangeObject.startIndex; index < this._thumbPageRangeObject.endIndex + 1; index++){
  		this._thumbsArray.push(this.createImage(index));
  	}
  };

  FlickrGalleryThumbsViewController.prototype.removeThumbs = function(){
  	var thumb;
  	for(var i=0; i < this._thumbsArray.length; i++){
  		thumb = this._thumbsArray[i];
  		remove(thumb);					//remove from dom
  	}
  	this._thumbsArray = [];
  };

  FlickrGalleryThumbsViewController.prototype.createImage = function(imageIndex){
  	var imageObject = this._dataManager.getImageObjectByIndex(imageIndex);

  	/*
  	var thumb = new Image();
  	attr(thumb, "class", "flickrGallery-thumb");
  	thumb.src = this._dataManager.getImageSrcByImageObject(this._dataManager.getImageObjectByIndex(imageIndex),"_s");
  	append(this._thumbsContainer,thumb);
  	//thumb.onClick = this.onThumbClick.context(this);
  	addEvent(thumb,"click",this.onThumbClick.context(this));
  	*/
  	var thumbButton = create('a');
  	attr(thumbButton, "class", "flickrGallery-thumb");
  	thumbButton.innerHTML = '<img src="'+this._dataManager.getImageSrcByImageObject(this._dataManager.getImageObjectByIndex(imageIndex),"_s")+'"/>'
  	append(this._thumbsContainer,thumbButton);
  	addEvent(thumbButton,"click",this.onThumbClick.context(this));

  	return thumbButton;
  };

  FlickrGalleryThumbsViewController.prototype.onThumbClick = function(e){
  	var thumb;
  	if(e.srcElement){		//MSIE
  		thumb = e.srcElement;
  	}else{
  		thumb = e.target;
  	}

  	if(thumb.nodeName === "IMG"){//srElement can be the img so check and set to <a> if need be.
  		thumb = thumb.parentNode;
  	}

  	var thumbPageContextIndex = this._thumbsArray.indexOf(thumb);
  	this._thumbPageRangeObject = this._dataManager.getThumbPageRange();
  	var thumbIndex = this._thumbPageRangeObject.startIndex + thumbPageContextIndex;
  	//console.log("thumbindex:"+thumbIndex);
  	this._dataManager.setSelectedIndex(thumbIndex);
  }



  //PUBLIC
  //___________________________________________________________________________________________________________________
  FlickrGalleryThumbsViewController.prototype.getThumbsContainer = function(){
  	return this._thumbsContainer;
  };
  //end of FlickrGalleryThumbsViewController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________








  //FlickrGalleryUIAnimationController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________
  // JavaScript Document
  var FlickrGalleryUIAnimationController = function(flickrGallery) {
      this._dataManager = flickrGallery.getDataManager();
      this._flickrGallery = flickrGallery;
      this._flickrGalleryContainer = this._flickrGallery.getFlickrGalleryContainer();
      this._thumbsContainer = flickrGallery.getThumbsViewController().getThumbsContainer();
      this._controlsContainer = flickrGallery.getControlViewController().getControlsContainer();

      this._height;
      this._thumbsContainerAnimationMode = "opened";
      this._controlsContainerAnimationMode = "opened";
      this._initialised = false;

      this.init();
  };

  FlickrGalleryUIAnimationController.prototype.init = function() {
      this._height = fullHeight(this._flickrGalleryContainer);
      this._width = fullWidth(this._flickrGalleryContainer);
      this._dataManager.addEventListener("updateSelected", this.onUpdateSelected.context(this));
  };

  FlickrGalleryUIAnimationController.prototype.onMouseMoveHandler = function(e) {
      //console.log("x:"+e.clientX+" y:"+e.clientY);
      var gallery = this._flickrGallery.getFlickrGalleryContainer();
      //var galleryY = pageY(gallery);
      //var galleryX = parseInt($(gallery).offset().left);
      var galleryY = parseInt($(gallery).offset().top);
      var pageScrollY = scrollY();

      var posY = (e.clientY + pageScrollY) - galleryY;
     // console.log('galleryY:' + galleryY + ' posY:' + posY + ' e.clientY:' + e.clientY + ' pageScrollY:' + pageScrollY);

      if (posY > (this._height / 3) * 2) {
          if (this._thumbsContainerAnimationMode === "closed") {
              this.showThumbsContainer();
              this._thumbsContainerAnimationMode = "opening";
          }
      } else {
          if (this._thumbsContainerAnimationMode === "opened" || this._thumbsContainerAnimationMode === "opening") {
              this.hideThumbsContainer();
              this._thumbsContainerAnimationMode = "closing";
          }
      }

      if (posY < this._height / 3) {
          if (this._controlsContainerAnimationMode === "closed") {
              this.showControlsContainer();
              this._controlsContainerAnimationMode = "opening";
          }
      } else {
          if (this._controlsContainerAnimationMode === "opened" || this._controlsContainerAnimationMode === "opening") {
              this.hideControlsContainer();
              this._controlsContainerAnimationMode = "closing";
          }
      }
  };

  FlickrGalleryUIAnimationController.prototype.onMouseOutHandler = function(e) {
      //console.log("onMouseOutHandler");
      /*
      var gallery = this._flickrGallery.getFlickrGalleryContainer();
      var galleryX = parseInt($(gallery).offset().left);
      var galleryY = parseInt($(gallery).offset().top);
      var posX = e.clientX - galleryX;
      var posY = e.clientY - galleryY;
  
      */
  

      //if (posX < 5 || posX > this._width || posY < 5 || posY > this._height) {
      if (this._thumbsContainerAnimationMode === "opened" || this._thumbsContainerAnimationMode === "opening") {
          this.hideThumbsContainer();
          this._thumbsContainerAnimationMode = "closing";
      }
      if (this._controlsContainerAnimationMode === "opened" || this._controlsContainerAnimationMode === "opening") {
          this.hideControlsContainer();
          this._controlsContainerAnimationMode = "closing";
      }
     // }
     // console.log("x:"+posX+" y:"+posY+" h:"+this._height);
  };

  FlickrGalleryUIAnimationController.prototype.onUpdateSelected = function() {
      if (this._initialised === false) {
          this._initialised = true;
          addEvent(this._flickrGallery.getFlickrGalleryContainer(), "mousemove", this.onMouseMoveHandler.context(this));
          //addEvent(this._flickrGallery.getFlickrGalleryContainer(), "mouseout", this.onMouseOutHandler.context(this));
          $(this._flickrGallery.getFlickrGalleryContainer()).mouseleave(this.onMouseOutHandler.context(this));
          //this._flickrGallery.getFlickrGalleryContainer().onmouseout = this.onMouseOutHandler.context(this);
      }
  }

  FlickrGalleryUIAnimationController.prototype.hideThumbsContainer = function() {
      var thumbContainerHeight = fullHeight(this._thumbsContainer);
      $(this._thumbsContainer).stop(true, true);
      $(this._thumbsContainer).animate({
          bottom: -200
      },
  		{
  		    duration: 500,
  		    queue: false,
  		    complete: this.hideThumbsContainerComplete.context(this)
  		});
  }

  FlickrGalleryUIAnimationController.prototype.hideThumbsContainerComplete = function() {
      this._thumbsContainerAnimationMode = "closed";
  }


  FlickrGalleryUIAnimationController.prototype.showThumbsContainer = function() {
      $(this._thumbsContainer).stop(true, true);
      $(this._thumbsContainer).animate({
          bottom: 0
      },
  		{
  		    duration: 500,
  		    queue: false,
  		    complete: this.showThumbsContainerComplete.context(this)
  		});
  }

  FlickrGalleryUIAnimationController.prototype.showThumbsContainerComplete = function() {
      this._thumbsContainerAnimationMode = "opened";
  }



  FlickrGalleryUIAnimationController.prototype.hideControlsContainer = function() {
      var controlsContainerHeight = fullHeight(this._controlsContainer);
      //console.log("hideControlsContainer height="+controlsContainerHeight);
      $(this._controlsContainer).stop(true, true);
      $(this._controlsContainer).animate({
          top: -100
      },
  		{
  		    duration: 500,
  		    queue: false,
  		    complete: this.hideControllsContainerComplete.context(this)
  		});
  }

  FlickrGalleryUIAnimationController.prototype.hideControllsContainerComplete = function() {
      this._controlsContainerAnimationMode = "closed";
  }


  FlickrGalleryUIAnimationController.prototype.showControlsContainer = function() {
      $(this._controlsContainer).stop(true, true);
      $(this._controlsContainer).animate({
          top: 0
      },
  		{
  		    duration: 500,
  		    queue: false,
  		    complete: this.showControlsContainerComplete.context(this)
  		});
  }

  FlickrGalleryUIAnimationController.prototype.showControlsContainerComplete = function() {
      this._controlsContainerAnimationMode = "opened";
  }
  //end of FlickrGalleryUIAnimationController.js
  //_____________________________________________________________________________________________________________________________________________________________________________________________________________________________









  //event.js
  //____________________________________________________________________________________________________________________________________

  // written by Dean Edwards, 2005
  // with input from Tino Zijdel, Matthias Miller, Diego Perini

  // http://dean.edwards.name/weblog/2005/10/add-event/

  function addEvent(element, type, handler) {
  	if (element.addEventListener) {
  		element.addEventListener(type, handler, false);
  	} else {
  		// assign each event handler a unique ID
  		if (!handler.$$guid) handler.$$guid = addEvent.guid++;
  		// create a hash table of event types for the element
  		if (!element.events) element.events = {};
  		// create a hash table of event handlers for each element/event pair
  		var handlers = element.events[type];
  		if (!handlers) {
  			handlers = element.events[type] = {};
  			// store the existing event handler (if there is one)
  			if (element["on" + type]) {
  				handlers[0] = element["on" + type];
  			}
  		}
  		// store the event handler in the hash table
  		handlers[handler.$$guid] = handler;
  		// assign a global event handler to do all the work
  		element["on" + type] = handleEvent;
  	}
  };
  // a counter used to create unique IDs
  addEvent.guid = 1;

  function removeEvent(element, type, handler) {
  	if (element.removeEventListener) {
  		element.removeEventListener(type, handler, false);
  	} else {
  		// delete the event handler from the hash table
  		if (element.events && element.events[type]) {
  			delete element.events[type][handler.$$guid];
  		}
  	}
  };

  function handleEvent(event) {
  	var returnValue = true;
  	// grab the event object (IE uses a global event object)
  	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
  	// get a reference to the hash table of event handlers
  	var handlers = this.events[event.type];
  	// execute each event handler
  	for (var i in handlers) {
  		this.$$handleEvent = handlers[i];
  		if (this.$$handleEvent(event) === false) {
  			returnValue = false;
  		}
  	}
  	return returnValue;
  };

  function fixEvent(event) {
  	// add W3C standard event methods
  	event.preventDefault = fixEvent.preventDefault;
  	event.stopPropagation = fixEvent.stopPropagation;
  	return event;
  };
  fixEvent.preventDefault = function() {
  	this.returnValue = false;
  };
  fixEvent.stopPropagation = function() {
  	this.cancelBubble = true;
  };


  //end of event.js
  //____________________________________________________________________________________________________________________________________








  //helpers.js
  //____________________________________________________________________________________________________________________________________
  function cleanWhitespace(element) {
  	element = element || document;
  	var cur = element.firstChild;
  	while(cur != null) {
  		if( cur.nodeType == 3 && ! /\S/.test(cur.nodeValue)){
  			element.removeChild(cur);	
  		}else if(cur.nodeType==1){
  			cleanWhitespace(cur);
  		}
  		cur = cur.nextSibling;
  	}
  }

  function prev(elem) {
  	do {
  		elem = elem.previousSibling;
  	} while (elem && elem.nodeType != 1);
  	return elem;
  }

  function next(elem) {
  	do {
  		elem = elem.nextSibling;
  	}while (elem && elem.nodeType != 1);
  	return elem;
  }

  function first(elem){
  	elem = elem.firstChild;
  	return elem && elem.nodeType != 1 ? next( elem) : elem;
  }

  function last(elem) {
  	elem = elem.lastChild;
  	return elem && elem.nodeType != 1 ? prev(elem) : elem;	
  }

  function parent(elem,num) {
  	num = num || 1;
  	for(var i=0;i<num;i++){
  		if(elem != null){
  			elem = elem.parentNode;		
  		}
  	}
  	return elem;
  }

  function id(name) {
  	return document.getElementById(name);	
  }

  function tag(name, elem) {
  	return (elem || document).getElementsByTagName(name);	
  }

  function domReady(f){
  	if(domReady.done){
  		return f();
  	}
  	if(domReady.timer){
  		domReady.ready.push(f);
  	}else{
  		addEvent(window, "load", isDOMReady);
  		domReady.ready = [f];
  		domReady.timer = setInterval( isDOMReady,13);	
  	}	
  }

  function isDOMReady() {
  	if(domReady.done) return false;
  	if(document && document.getElementById && document.getElementsByTagName && document.body) {
  		clearInterval(domReady.timer);
  		domReady.timer = null;
  		for(var i=0;i<domReady.ready.length;i++){
  			domReady.ready[i]();	
  		}
  		domReady.ready = null;
  		domReady.done = true;
  	}
  }

  function hasClass(name,type){
  	var r = [];
  	var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
  	var e = document.getElementsByTagName(type || "*");
  	for(var j=0;j<e.length;j++){
  		if(re.test(e[j])){
  			r.push(e[j]);
  		}
  	}
  	return r;
  }
  function text(e){
  	var t = "";
  	e = e.childNodes || e;
  	for(var j=0;j<e.length;j++){
  		j += e[j].nodeType != 1 ? e[j].nodeValue : text(e[j].childNodes);
  	}
  	return t;
  }
  function hasAttribute(elem,name) {
  	return elem.getAttribute(name) != null;	
  }
  function attr(elem, name, value){
  	if( !name || name.constructor != String ) return '';
  	name = {'for':'htmlFor', 'class':'className'}[name] || name;
  	if(typeof value != 'undefined'){
  		elem[name] = value;
  		if(elem.setAttribute){
  			elem.setAttribute(name,value);
  		}
  	}
  	return elem[name] || elem.getAttribute(name) || '';
  }

  function create( elem) {
  	return document.createElementNS ? document.createElementNS('http://www.w3.org/1999/xhtml',elem) : document.createElement(elem);	
  }
  function before(parent, before, elem){
  	if(elem == null){
  		elem = before;
  		before = parent;
  		parent = before.parentNode;	
  	}
  	parent.insertBefore(checkElem( elem),before);
  }
  function append(parent, elem){
  	parent.appendChild( checkElem( elem));	
  }

  function remove(elem){
  	if(elem) elem.parentNode.removeChild( elem );
  }

  function empty ( elm ) {
  	while( elem.firstChild) remove(elem.fistChild);
  }

  function checkElem(elem) {
  	return elem && elem.constructor == String ? document.createTextNode(elem) : elem;	
  }

  //CSS
  function getStyle(elem,name) {
  	if(elem.style[name]){
  		return elem.style[name];
  	}else if(elem.currentStyle){
  		return elem.currentStyle[name];
  	}else if(document.defaultView && document.defaultView.getComputedStyle){
  		name = name.replace(/(A-Z])/g,"-$1");
  		name = name.toLowerCase();
  		var s = document.defaultView.getComputedStyle(elem,"");
  		return s && s.getPropertyValue(name);
  	}else {
  		return null;
  	}
  }

  function posX(elem) {
  	return parseInt( getStyle(elem,'left'));	
  }

  function posY(elem) {
  	return parseInt( getStyle(elem,'top'));	
  }

  function getHeight(elem) {
  	return parseInt( getStyle(elem,'height'));	
  }

  function getWidth(elem) {
  	return parseInt( getStyle(elem,'width'));
  }

  function pageX(elem) {
      if (elem.offsetParent) {
          return elem.offsetLeft + pageX(elem.offsetParent);
      } else {
          return elem.offsetLeft;
      }
  }

  function pageY(elem) {
      if (elem.offsetParent) {
          return elem.offsetTop + pageX(elem.offsetParent);
      } else {
          return elem.offsetTop;
      }
      //return elem.offsetParent ? elem.offsetTop + pageY( elem.offsetParent ) : elem.offsetTop;	
  }

  function fullWidth(elem) {
      if (getStyle(elem, 'display') != "none") {
          return elem.offsetWidth || getWidth(elem);
      }
      var old = resetCSS(elem, {
          display: '',
          visibility: 'hidden',
          position: 'absolute'
      });
      var w = elem.clientWidth || getWidth(elem);
      restore(elem, old);
      return w;
  }

  function fullHeight(elem) {
  	if(getStyle( elem, 'display') != "none") {
  		return elem.offsetHeight || getHeight(elem);	
  	}
  	var old = resetCSS(elem, {
  		display: '',
  		visibility: 'hidden',
  		position: 'absolute'	
  	});
  	var h = elem.clientHeight || getHeight( elem);
  	restore(elem,old);
  	return h;
  }

  function resetCSS(elem,prop){
  	var old = {};
  	for(var i in prop){
  		old[i] = elem.style[i];
  		elem.style[i] = prop[i];
  	}
  	return old;
  }

  function restoreCSS( elem,prop) {
  	for(var i in prop){
  		elem.style[i] = prop[i];
  	}
  }

  function scrollY() {
      var de = document.documentElement;
  
      return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
  }

  function disableSelection(target){
  	if (typeof target.onselectstart!="undefined") //IE route
  		target.onselectstart=function(){return false}

  	else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
  		target.style.MozUserSelect="none"

  	else //All other route (ie: Opera)
  		target.onmousedown=function(){return false}

  	target.style.cursor = "default"
  }




  //AJAX
  if( typeof XMLHttpRequest == "undefined"){
  	XMLHttpRequest = function(){
  		return new ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
  	};
  }
  function ajax(options){
  	options = {
  		type: options.type || "POST",
  		url: options.url || "",
  		timeout: options.timeout || 5000,
  		onComplete: options.onComplete || function(){},
  		onError: options.onError || function(){},
  		onSuccess: options.onSuccess || function(){},
  		data: options.data || ""
  	};

  	var xml = new XMLHttpRequest();
  	xml.open(options.type, options.url, true);
  	var timeoutLength = options.timeout;
  	var requestDone = false;
  	setTimeout(function(){
  		requestDone = true;
  	}, timeoutLength);
  	xml.onreadystatechange = function(){
  		if( xml.readyState == 4 && !requestDone ){
  			if( httpSuccess(xml) ) {
  				options.onSuccess(httpData( xml, options.type));	
  			} else {
  				options.onError();
  			}
  			options.onComplete();
  			xml = null;
  		}
  	};
  	xml.send();
  	function httpSuccess(r) {
  		try {
  			var test1 = !r.status && (location.protocol.indexOf("file") == 0);
  			var test2 = (r.status >= 200 && r.status < 300);
  			var test3 = r.status == 304;
  			var test4 = navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == "undefined";
  			//var test5 = navigator.userAgent.indexOf("Safari") >= 0 && r.status == 0;
  			//var test6 = navigator.userAgent.indexOf("Firefox") >= 0 && r.status == 0;
		
  			return test1 || test2 || test3 || test4;// || test5 || test6;
		
  			//return !r.status && location.protocol == "file" || (r.status >= 200 && r.status < 300) || r.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == "undefined" || navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == 0;
  		}catch(e){}
  		return false;
  	}

  	function httpData(r,type){
  		var ct = r.getResponseHeader("content-type");
  		var data = !type && ct && ct.indexOf("xml") >= 0;
  		data = type == "xml" || data ? r.responseXML : r.responseText;
  		if( type == "script" ){
  			eval.call(window, data);
  		}
  		return data;
  	}
  }


  Function.prototype.method = function(name,func){
  	this.prototype[name] = func;
  	return this;
  };

  Function.method('inherits', function (parent) {
      var d = {}, p = (this.prototype = new parent());
      this.method('uber', function uber(name) {
          if (!(name in d)) {
              d[name] = 0;
          }        
          var f, r, t = d[name], v = parent.prototype;
          if (t) {
              while (t) {
                  v = v.constructor.prototype;
                  t -= 1;
              }
              f = v[name];
          } else {
              f = p[name];
              if (f == this[name]) {
                  f = v[name];
              }
          }
          d[name] += 1;
          r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
          d[name] -= 1;
          return r;
      });
      return this;
  });

  Function.method('swiss',function(parent) {
  	for(var i=1; i< arguments.length; i+=1){
  		var name = arguments[i];
  		this.prototype[name] = parent.prototype[name];
  	}
  	return this;
  });

  // Allows for binding context to functions
  // when using in event listeners and timeouts

  Function.prototype.context = function(obj){
    var method = this,
    temp = function(){
      return method.apply(obj, arguments);
    };
    return temp;
  };



  // Like context, in that it creates a closure
  // But insteaad keep "this" intact, and passes the var as the second argument of the function
  // Need for event listeners where you need to know what called the event
  // Only use with event callbacks

  Function.prototype.evtContext = function(obj){
    var method = this,
    temp = function(){
      var origContext = this;
      return method.call(obj, arguments[0], origContext);
    };
    return temp;
  };



  // Removeable Event listener with Context
  // Replaces the original function with a version that has context
  // So it can be removed using the original function name.
  // In order to work, a version of the function must already exist in the player/prototype

  Function.prototype.rEvtContext = function(obj, funcParent){
    if (this.hasContext === true) { return this; }
    if (!funcParent) { funcParent = obj; }
    for (var attrname in funcParent) {
      if (funcParent[attrname] == this) {
        funcParent[attrname] = this.evtContext(obj);
        funcParent[attrname].hasContext = true;
        return funcParent[attrname];
      }
    }
    return this.evtContext(obj);
  };



  //end of helpers.js
  //____________________________________________________________________________________________________________________________________







  //FlickrGallery.js
  //____________________________________________________________________________________________________________________________________
  var FlickrGalleryMain = function(options){
  	this.SCALE_TO_FIT = "scaleToFit";
  	this.SCALE_TO_FILL = "scaleToFill";

  	this._containerId = options.containerId;
  	this._apiKey = options.apiKey;
  	this._userId = options.userId;
  	this._photoSetId = options.photoSetId;
  	this._options = options;
  	this._scaleMode = (options.scaleMode)? options.scaleMode: this.SCALE_TO_FILL;
	this._showThumbs = options.showThumbs ? options.showThumbs : false;
	this._clickPreviewToLinkMode = true;

  	this._dataManager;
  	this._previewViewController;
  	this._loadingViewController;
  	this._controlViewController;
  	this._thumbsViewController;
  	this._uiAnimationController;
  	

  	this.init();
  }

  FlickrGalleryMain.prototype.init = function(){
  	this._dataManager = new FlickrGalleryDataManager(this._options);
  	this._previewViewController = new FlickrGalleryPreviewViewController(this);
  	this._loadingViewController = new FlickrGalleryLoadingViewController(this);
  	this._controlViewController = new FlickrGalleryControlViewController(this);
  	if(this._showThumbs === true){
  	    this._thumbsViewController = new FlickrGalleryThumbsViewController(this);
    }
  	//this._uiAnimationController = new FlickrGalleryUIAnimationController(this);

  	this._dataManager.load();
  };





  //PUBLIC
  //__________________________________________________________________________________________
  FlickrGalleryMain.prototype.getDataManager = function(){
  	return this._dataManager;	
  }

  FlickrGalleryMain.prototype.getPreviewViewerController = function(){
  	return this._previewViewController;	
  }

  FlickrGalleryMain.prototype.getThumbsViewController = function(){
  	return this._thumbsViewController;	
  }

  FlickrGalleryMain.prototype.getControlViewController = function(){
  	return this._controlViewController;	
  }

  FlickrGalleryMain.prototype.getFlickrGalleryContainer = function(){
  	return document.getElementById(this._containerId);	
  }

  FlickrGalleryMain.prototype.getScaleMode = function(){
  	return this._scaleMode;	
  }
  
  FlickrGalleryMain.prototype.getClickPreviewToLinkMode = function(){
    	return this._clickPreviewToLinkMode;	
  }

  FlickrGalleryMain.prototype.getUserID = function(){
      return this._userId;
  }

  //end of FlickrGallery.js
  //____________________________________________________________________________________________________________________________________
  var flickrGalleryMain = new FlickrGalleryMain(options);
  };


}).call(this);