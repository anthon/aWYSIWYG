(function($,window,undefined) {

	$.fn.aWYSIWYG = function(options) {
		
		function WYSIWYG(el,s) {
			
			var aWYSIWYG = this, textBox = el, iFrame, Editor, css, toolbar;
		
			function init(s) {
				
				var textBox_id = textBox.attr('id');
				
				iFrame = document.createElement('iframe');
				iFrame.frameBorder = 0;
				iFrame.frameMargin = 0;
				iFrame.framePadding = 0;
				iFrame.height = textBox.height() + 10;
				iFrame.width = textBox.width() + 10;
				iFrame.style.backgroundColor = textBox.css('backgroundColor');
				iFrame.style.border = "1px solid #CCC";
				iFrame.style.borderTop = "1px solid #666";
				if(textBox.attr('class')){
					iFrame.className = textBox.attr('class');
				}
				iFrame.id = textBox_id + "-iFrame";
				iFrame.onload = appendCSS;
				
				textBox.after(iFrame);
				textBox.before(buildToolbar());
				
				enableDesignMode();
				
				$(iFrame).bind('mouseleave',function(){
					getText();
				});
				
				$(Editor).blur(function(){
					getText();
				});
				textBox.prev(".toolbar").find("a").click(function(){
					getText();
				});
				textBox.closest("form").submit(function(){
					getText();
				});
			}
			
			function appendCSS() {
			
				if($.browser.msie) {
					var body = iFrame.document.documentElement;
				} else {
					var body = Editor.body;
				}
				// here extra styles defined on the iFrame body
//				body.style.fontFamily = textBox.css('font-family');
//				body.style.fontSize = textBox.css('font-size');
//				body.style.fontSize = "11";
//				body.style.lineHeight = textBox.css('line-height');
				body.style.margin = "0px";
				body.style.padding = textBox.css('padding-left');
				body.style.cursor = "text";
				
				// apply external CSS if enabled
				if(settings.extStyles) {
					css = document.createElement('link');
					css.type = "text/css";
					css.rel = "stylesheet";
					css.href = settings.extStyles;
					
					if($.browser.msie) {
						Editor.documentElement.firstChild.appendChild(css);
					} else {
						Editor.getElementsByTagName("head")[0].appendChild(css);
					}
				}
			}
			
			function enableDesignMode() {
				textBox.hide();
				if(iFrame.contentWindow) {
					Editor = iFrame.contentWindow.document;
				} else if(iFrame.contentDocument) {
					Editor = iFrame.contentDocument;
				} else if(iFrame.document) {
					Editor = iFrame.document;
				}
				
				// extra bit to set the font
				try {
					Editor.open();
					Editor.write(textBox.val());
					Editor.close();
				} catch(e) {
					//console.log(e);
				}
				Editor.designMode = 'on';
				// disable CSS in Gecko, IE and Opera
				try {
					// Gecko method
					Editor.execCommand('styleWithCSS', 0, false);
				} catch(e) {
					try {
						// vintage method
						Editor.execCommand('useCSS', 0, true);
					} catch(e) {
					
					}
				}
				$(iFrame).show();
				toolbar.show();
			}
			
			function disableDesignMode() {
				getText();
				$(iFrame).hide();
				toolbar.hide();
				textBox.show();
			}
			
			function buildToolbar() {
	/*
				toolbar = $("<div class='toolbar'>\
					<a href=\"#\" class='undo'>undo</a> \
				  	<a href=\"#\" class='redo'>redo</a> &nbsp;&nbsp;&nbsp; \
				  	<a href=\"#\" class='bold'>bold</a> \
				  	<a href=\"#\" class='italic'>italic</a> &nbsp;&nbsp;&nbsp; \
				  	<a href=\"#\" class='left'>left</a> \
				  	<a href=\"#\" class='center'>center</a> \
				  	<a href=\"#\" class='right'>right</a> &nbsp;&nbsp;&nbsp; \
				  	<a href=\"#\" class='addURL'>link</a> \
				  	<a href=\"#\" class='removeURL'>unlink</a> &nbsp;&nbsp;&nbsp; \
				  	<a href=\"#\" class='addIMG'>image</a> &nbsp;&nbsp;&nbsp; \
				  	<a href=\"#\" class='preview'>HTML</a>\
				  	</div>");
	*/
				if(options.icons) {
	/*
					toolbar = $("<div class='aWYSWYG_toolbar'>\
						<a href=\"#\" class='undo'><img src='"+options.imgPath+"/undo.gif'/></a>\
					  	<a href=\"#\" class='redo'><img src='"+options.imgPath+"/redo.gif'/></a> | \
					  	<a href=\"#\" class='bold'><img src='"+options.imgPath+"/bold.gif'/></a>\
					  	<a href=\"#\" class='italic'><img src='"+options.imgPath+"/italic.gif'/></a> | \
					  	<a href=\"#\" class='alignLeft'><img src='"+options.imgPath+"/align_left.gif'/></a>\
					  	<a href=\"#\" class='alignCenter'><img src='"+options.imgPath+"/align_center.gif'/></a>\
					  	<a href=\"#\" class='alignRight'><img src='"+options.imgPath+"/align_right.gif'/></a> | \
					  	<a href=\"#\" class='addURL'><img src='"+options.imgPath+"/insert_link.gif'/></a>\
					  	<a href=\"#\" class='removeURL'><img src='"+options.imgPath+"/remove_link.gif'/></a> | \
					  	<a href=\"#\" class='biggerText'><img src='"+options.imgPath+"/text_bigger.gif'/></a>\
					  	<a href=\"#\" class='smallerText'><img src='"+options.imgPath+"/text_smaller.gif'/></a> | \
					  	<a href=\"#\" class='clean'>clean</a> | \
					  	<a href=\"#\" class='list'>list</a>\
					  	</div>");
	*/
					toolbar = $("<div class='aWYSWYG_toolbar'>\
					  	<a href=\"#\" class='bold'><img src='"+options.imgPath+"/bold.gif'/></a>\
					  	<a href=\"#\" class='italic'><img src='"+options.imgPath+"/italic.gif'/></a>\
					  	<a href=\"#\" class='list'>list</a>\
					  	</div>");
				} else {
/*
					toolbar = $("<div class='aWYSWYG_toolbar'>\
						<a href=\"#\" class='undo'>undo</a> \
					  	<a href=\"#\" class='redo'>redo</a> &nbsp;&nbsp;&nbsp; \
					  	<a href=\"#\" class='bold'>bold</a> \
					  	<a href=\"#\" class='italic'>italic</a> &nbsp;&nbsp;&nbsp; \
					  	<a href=\"#\" class='addURL'>link</a> \
					  	<a href=\"#\" class='removeURL'>unlink</a> &nbsp;&nbsp;&nbsp; \
					  	</div>");
*/
					toolbar = $("<div class='aWYSWYG_toolbar'>\
					  	<a href=\"#\" class='bold'>bold</a> \
					  	<a href=\"#\" class='italic'>italic</a> &nbsp;&nbsp;&nbsp; \
					  	</div>");
				}
				
				if($("#aWYSIWYG_classes").length > 0) {
					var cssURL = $("#aWYSIWYG_classes").attr('href');
					jQuery.get(cssURL, null, function(data) {
						var classes = data.match(/\.\w+\s+\{/gi);
						var selector = "| <select >\
							<option value=\"\">\
								- class -\
							</option>";
						for(var i=0;i<classes.length;i++) {
							classes[i] = classes[i].replace(/[\s\{\.]/gi,"");
							selector += "<option value=\"" + classes[i] + "\">";
							selector += toString(classes[i]);
							selector += "</option>";
						}
						selector += "</select>";
						toolbar.append(selector);
					});
				}
				
	//			$('.undo', toolbar).click(function(){ applyToText('undo'); return false; });
	//			$('.redo', toolbar).click(function(){ applyToText('redo'); return false; });
				$('.bold', toolbar).click(function(){ applyToText('bold'); return false; });
				$('.italic', toolbar).click(function(){ applyToText('italic'); return false; });
	//			$('.alignLeft', toolbar).click(function(){ applyToText('justifyleft'); return false; });
	//			$('.alignCenter', toolbar).click(function(){ applyToText('justifycenter'); return false; });
	//			$('.alignRight', toolbar).click(function(){ applyToText('justifyright'); return false; });
	//			$('.addURL', toolbar).click(function(){ addURL(); return false; });
	//			$('.removeURL', toolbar).click(function(){ applyToText('unlink'); return false; });
	//			if($.browser.msie) {
	//				$('.biggerText', toolbar).click(function(){ ieFontSize('increase'); return false; });
	//				$('.smallerText', toolbar).click(function(){ ieFontSize('decrease'); return false; });
	//			} else {
	//				$('.biggerText', toolbar).click(function(){ applyToText('increasefontsize'); return false; });
	//				$('.smallerText', toolbar).click(function(){ applyToText('decreasefontsize'); return false; });
	//			}
	//			$('.clean', toolbar).click(function(){ cleanText(); return false; });
				$('.list', toolbar).click(function(){ applyToText('insertunorderedlist'); return false; });
	/*
				$('.addIMG', toolbar).click(function(){ addImage(); return false; });
				$('.preview', toolbar).click(function(){ disableDesignMode(); return false; });
	*/
				return toolbar;
			}
			
			function applyToText(cmd) {
				Editor.execCommand(cmd, false, null);
				getText();
			}
			
			
			function cleanText() {
				Editor.body.innerHTML = Editor.body.innerHTML.replace(/<[^>].*?>/gi,"");
				getText();
			}
			
			function addURL() {
				var url = prompt("Enter a URL:", "http://");
				if((url != null) && (url != "")){
					var theLink = Editor.execCommand('CreateLink', false, url);
					theLink.target = "_blank";
				}
				getText();
			}
			
			function addClass(cls) {
				// to be continued...
			}
			
			function addImage() {
				var imgURL = prompt("Enter a URL:", "http://");
				if((imgURL != null) && (imgURL != "")){
					Editor.execCommand('InsertImage', false, imgURL);
				}
			}
			
			function getText() {
				content = Editor.body.innerHTML.replace("\n","");
				if(content != "<br>") {
					textBox.val(Editor.body.innerHTML.replace("\n",""));
				}
			}
			
			function ieFontSize(dir) {
				var range = Editor.selection.createRange();
				var sel = range.htmlText;
				if(dir == 'increase') {
					sel = "<big>" + sel + "<big>";
				} else {
					sel = sel.replace(/<big>/i,"");
					sel = sel.replace(/<\/big>/i,"");
				}
				range.pasteHTML("");
				range.pasteHTML(sel);
				getText();
			}
			
			function colourPallete(dir, width, height) {
				var r = 0;
				var g = 0;
				var b = 0;
				var numList = new Array(6);
				var colour = '';
				numList[0] = '00';
				numList[1] = '40';
				numList[2] = '80';
				numList[3] = 'BF';
				numList[4] = 'FF';
				document.writeln('<table cellspacing="1" cellpadding="0" border="0">');
				for(r = 0; r<5; r++) {
					if(dir == 'h') {
						document.writeln('<tr>');
					}			
					for(g = 0; g<5; g++) {
						if(dir == 'v') {
							document.writeln('<tr>');
						}
						for(b = 0; b<5; b++) {
							colour = String(numList[r])+String(numList[g])+String(numList[b]);
							document.write('<td bgcolor="#'+colour+'" style="width:'+width+'px; height:'+height+'px;">');
							document.write('<a href="#" onclick="setColour(\'#'+colour+'\'); return false;">k</a>');
							document.writeln('</td>');
						}
						if(dir == 'v') {
							document.writeln('</tr>');
						}
					}
					if(dir == 'h') {
						document.writeln('</tr>');
					}
				}
				document.writeln('</table>')
			}
			
			function setColour(colour) {
				Editor.execCommand('color', false, colour);
			}
			
			$.extend(
				aWYSIWYG,
				{
					reload: function() {
						enableDesignMode();
					},
					unload: function() {
						disableDesignMode();
					}
				}
			);
			
			init();
		}
		
		var defaults = {
				imgPath: '../imgs/static/aWYSIWYG',
				extStyles: '../css/main.css',
				icons: true,
			},
			settings = $.extend({}, defaults, options);
		
		return this.each(function() {
			var el = $(this), wysiwyg = el.data('aWYSIWYG');
			if(wysiwyg) {
				wysiwyg.reload();
			} else {
				var wyswyg = new WYSIWYG(el,settings);
				el.data('aWYSIWYG',wyswyg);
			}
		});
		
	};
	
}) (jQuery,this);