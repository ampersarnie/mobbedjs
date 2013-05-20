/*

	mobbed.js v0.1

	by Paul Taylor     http://ampersandwich.co.uk
	Twitter:           @ampersarnie
	ADN:               @pmt
	Latest version:    https://github.com/ampersarnie/mobbedjs

	mobbed.js, furthering responsive design for quicker mobile loading.

*/

var mobbed	= function (options, complete) {

	/*
		Let's set up some base variables, yo.
	*/
	var doc					= document,
        docEle              = doc.documentElement,
        docVis              = docEle.style.visibility,
		loadtime			= 0,
		imgs				= doc.images,
		totalKB				= false,
		log					= false,
		progressKB			= false,
		elapsed				= false,
		ident				= '',
		completed			= false,
		thisFile			= '',
		exceptionClasses	= [],
		exceptionIds		= [],
		exceptionElements	= [],
		cbComplete			= [];

	/*
		Logging variable.
	*/
	log	= {
		exceptions		: {},
		replacements	: {},
		network			: ''
	};

	/*
		Default settings, man.
	*/
	settings = {
		exceptions	: 'link,script',
		replacement	: false,
		identifier	: false
	};

	selfFiles = ['mobbed.js', 'mobbed.min.js'];

    /*
        Hide the main document element to prevent flickering.
    */
    docVis  = 'hidden';

	/*
		Go-go gadget script.
	*/
    var readyStateCheckInterval = setInterval(function() {
        if (document.body) {
            init();
            clearInterval(readyStateCheckInterval);
        }
    }, 10);

	/*
		init();
		=======
		Initializes the script
	*/
	function init(){
		/*
			Let's sort out those settings
		*/
		if(options) settingsMerge(settings, options);

		html	= document.documentElement.outerHTML;

		if(html.match(/<\/html>/gi)) {
			window.stop();
		}

		/*
			Initialize test and run doScript as
			the complete callback.
		*/
		doTest(function() {
			doScript();
		});

	}

	/*
		doScript();
		===========
		Once test is complete, doScript
		runs the rest of the process.
	*/
	function doScript() {

		/*
			If there are exceptions we're
			going to break them apart and
			loop through them.
		*/
		if(settings.exceptions) {

			/*
				We need to break apart exceptions
				as they're polyfills. We do this
				by removing spaces and splitting
				values by comma.
			*/
			exceptStrip		= settings.exceptions.replace(/\s/g, '');
			exceptElements	= exceptStrip.split(',');

			/*
				Despite having exceptions, we
				might want to replace one of those.
				replacements are also polyfills as
				above, so we're doing the same.
			*/
			if(settings.replacement) {

				var replaceStrip	= settings.replacement.replace(/\s/g, '');
				var replaceSplit	= replaceStrip.split(',');

			} else {
				/* no replacements */
				replaceSplit = false;

			}

			/*
				Let's loop through our exceptions
				and load them!
			*/
			for(var i=0; i < exceptElements.length; i++) {
				tag		= exceptElements[i];
				loadExceptions(tag, replaceSplit);
			}
		}

		/*
			Process the images!
		*/
		process(imgs);
	}

	/*
		loadExceptions();
		=================
		Resumes loading of specific elements.
	*/
	function loadExceptions(tag, replacements) {
		/*
			Get all elements based on tag or,
			if the exception is a class we get
			those, or by ID.
		*/
		if(isClass(tag)) {
			var targets	= doc.getElementsByClassName(tag.replace('.',''));
				exceptionClasses.push(tag.replace('.',''));
		} else if(isId(tag)) {
			var targets	= doc.getElementById(tag.replace('#',''));
				exceptionIds.push(tag.replace('#',''));
		} else {
			var targets	= doc.getElementsByTagName(tag);
				exceptionElements.push(tag);
		}

		/*
			No targets, lets finish here.
		*/
		if(!targets) return;

		/*
			Set log lengths, because.
		*/
		log.exceptions.length	= 0;
		log.replacements.length	= 0;

		/*
			Loop through the targets elements
			we've just created.
		*/

		for(var i=0; i < targets.length; i++) {

			/*
				We need to check the targets
				attributes to find the source
				reference points.
			*/
			var attr	= null;

			if('src' in targets[i]) {
				attr	= 'src';
			} else if('href' in targets[i]) {
				attr	= 'href';
			}

			/* We've got the attribute, so carry on. */
			if(targets[i][attr]) {

				/*
					Check for replacement.
					First break apart the target
					url and get the file.
				*/
				replaceParts	= targets[i][attr].split('/');
				replaceFile		= replaceParts.slice(-1)[0];


				/*
					Check if the file is our replacements
					list.
				*/
				if(inArray(replaceFile, replacements)) {
					/* It is */
					newTarget	= '';

					/*
						So now we have to reconstruct
						the target url, putting every
						value back except the last...
					*/
					for(var i=0; i < replaceParts.length; i++) {
						if(i !== (replaceParts.length-1)) {
							newTarget += replaceParts[i] + '/';
						}
					}

					/*
						...which we need to append our
						identifier to the url.
					*/
					newTarget			+= appendIdentifier(replaceFile);

					/*
						Load the file by inserting
						the url into the element.
					*/
					targets[0][attr]	= newTarget;
					log.replacements.length++;
					log.replacements[0]	= newTarget;

				} else {
					/*
						It isn't so we reload our
						file by inserting the url
						back into itself.
					*/
					targets[i][attr]	= targets[i][attr];
					log.exceptions.length++;
					log.exceptions[i]	= targets[i][attr];
				}
			}
		}
	}

	/*
		process()
		=========
	*/

	function process(images) {
        /*
            Remove visibility so we can see our
            glorious images.
		*/
        docVis	= '';

		for(var i=0; i < images.length; i++) {
			/*
				As we've done before we need
				to append an Identifier, only
				if exceptions don't exist.
			*/
			if(!hasClass(images[i].classList, exceptionClasses) && !hasId(images[i].id, exceptionIds)) {
				images[i].src	= appendIdentifier(images[i].src);
			} else {
				images[i].src	= images[i].src;
			}

		}

		/*
			And we're done, this is where the script
			finishes.
		*/
		cbComplete = {
			exceptions		: {
								files		: log.exceptions,
								elements	: exceptionElements,
								classes		: exceptionClasses,
								ids			: exceptionIds
								},
			elapsed			: {
								sec	: elapsed.sec,
								ms	: elapsed.ms
								},
			images			: doc.images,
			identifier		: ident,
			network 		: log.network,
			replacements	: log.replacements
		};

		complete(cbComplete);
	}

	/*
		doTest();
		Runs the test sequence.
	*/
	function doTest(callback) {

		/*
			Prepare by getting the script
			to find itself, we're using
			it for the test download.
		*/
		var thisFile	= (function() {
			var scripts	= doc.getElementsByTagName('script');

			for(var i=0; i < scripts.length; i++) {
				selfParts	= scripts[i].src.split('/');
				selfFile	= selfParts.slice(-1)[0];

				if(inArray(selfFile, selfFiles)) {
					return scripts[i].src;
				}
			}
		})();

		/*
			Add a random string to prevent
			caching. Whoop.
		*/
		thisFile += '?mbdjs=' + randString();

		/*
			Create a start time so we can
			measure the elapsed time.
		*/
		start = new Date().getTime();

		/*
			Create a http request of our test
			file. We're going to measure how
			long it takes to load.
		*/
		xmlhttp	= new XMLHttpRequest();

		xmlhttp.open("HEAD", thisFile, true);
        // xmlhttp.open("GET", thisFile, true);
		xmlhttp.send();

		/*
			Check for state changes.
		*/
		xmlhttp.onreadystatechange	= function() {
            /*
				When state reaches 4 (complete),
				we're going to check our times
				and set our identifiers based on
				how many miliseconds have elapsed.
			*/
			if(xmlhttp.readyState == 4) {
				elapsed		= new Date().getTime() - start;
				elapsedSec	= elapsed / 1000;

				ident		= '';
				log.network	= '';

				if(elapsed > '630') {
					ident          = '-3g';
					log.network    = '3G';
				}

				if(elapsed > '1800') {
					ident          = '-edge';
					log.network    = 'EDGE';
				}

				if(elapsed > '2000') {
					ident          = '-edge-slow';
					log.network    = 'EDGE (Slow)';
				}

				if(elapsed > '3600') {
					ident          = '-gprs';
					log.network    = 'GPRS';
				}

				elapsed = {'ms': elapsed, 'sec': elapsedSec };

				/*
                if(log.network) {
					/*
						Completely stops further content
						from being downloaded. Equivelent
						to pressing "stop" on browsers.

					window.stop();
                }
                */

				/*
					Run our call back, which should be
					process();
				*/
				callback();

			}
		}
	}

	/*
		appendIdentifier();
		===================
		Takes the target file and adds
		the identifier to the name.
		example: file.jpg => file-mobbed.jpg
	*/
	function appendIdentifier(target) {
		/*
			break the file name...
		*/
		newTarget	= target;
		/* Get extension */
		extension	= '.' + target.substring(target.lastIndexOf('.') + 1, target.length);

		/* Create replacement extension to include identifier */
		if(settings.identifier && log.network) {
			var replacement	= settings.identifier + extension;
		} else {
			var replacement	= ident + extension;
		}

		/* replace extension with the identifier */
		newTarget	= target.replace(extension, replacement);

		/* Return from whence thy came, wench. */
		return newTarget;
	}

	function settingsMerge(obj1, obj2) {
		for (var p in obj2) {
			try {
				if (obj2[p].constructor === Object) {
					obj1[p] = settingsMerge(obj1[p], obj2[p]);
				} else {
					obj1[p] = obj2[p];
				}
			} catch (e) {
				obj1[p] = obj2[p];
			}
		}
		return obj1;
	}
};

	/*
		Just a group of functions
		that are not specific
		and can be used globally.
		Names make them self explanitory.
	*/
	function inArray(needle, haystack) {
		for(var key in haystack) {
			if(needle === haystack[key]) return needle;
		}
		return false;
	}

	function isId(ids) {
		if(ids[0] == '#') return true;
		return false;
	}

	function hasId(ids, seek) {
		for(var i=0; i < ids.length; i++) {
			for(var si=0; si < seek.length; si++) {
				if(seek[si] == ids[i]) return true;
			}
		}
		return false;
	}

	function isClass(classes) {
		if(classes[0] == '.') return true;
		return false;
	}

	function hasClass(classes, seek) {
		for(var i=0; i < classes.length; i++) {
			for(var si=0; si < seek.length; si++) {
				if(seek[si] == classes[i]) return true;
			}
		}
		return false;
	}

    var getElementsByClassName = function(seek) {
        var elements    = this.getElementsByTagName('*'), i, returnClass = {};

        for (i in elements) {
            var classes    = elements[i].classList;
            for (c in classes) {
                if(classes[c] == seek) {
                    returnClass.elements[i].push(classes[c]);
                }
            }
        }

        return returnClass;
    }

	function randString() {
		var string		= '';
		var chars		= 'abcdefghijklmnopqrstuvwxyz0123456789';

		for( var i=0; i < 5; i++ ) {
			string += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return string;
	}