(function () {
	var url = 'http://rain.info.tm';
	var auth = 0;
	var send = 1;// флажок разрешения процесса проверки/отправки

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var save = function(json) {
		//~ console.log(json);
		var div = $('#rainright .save');
		//~ if (json['href'] ) {
			//~ div.append('<span style="color:green; font-weight:bold;"> Успешно: </span>'+'<a href="'+json['href']+'" target="_blank">'+json['href']+'</a>');
			//~ window.location = url;
		//~ } else {
			//~ div.append('<span style="color:red; font-weight:bold;"> Ошибка: '+json['msg']+'</span>')
		//~ }
		if (json.done) {div.append(json.done)}
		else {console.log(json)}
		var a = div.find('a');
		console.log(a);
		a.click();
		send=1;
	};
	
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var avito_check = function(html) {// 1. Проверка
		$('#rainright').find('.check').remove();
		if('check html: ', $(html).find('.form-error').each(function(index) {
			var div = $(this);
			var prev = div.prev();
			//~ console.log(prev.html());
			var sel = prev.find('select');
			var err = div.text();
			if(sel && sel.attr('title')) {
				err = sel.attr('title');
			}
			$('#rainright .err').append($('<li class="form-error"></li>').text(err).css({color:'red', 'font-weight':'bold'}));
		}).length) {
			send=1;
			return 1;
		}
		// Ошибок нет!
		$('#rainright').find('.check').append('<span style="color:green; font-weight:bold;"> Успешно </span>');
		$('#rainright').append('<div class="save"><span>Сохранение...</span></div>');
		//~ window.location = url;
		//~ return;
		$.ajax({type: 'POST', url:url+'/avito', dataType : "json", data: $('#btn-rain').closest('form').serialize(), xhrFields: {withCredentials: true}, crossDomain: true }).done(function(json) {save(json)}).fail(function( jqXHR) {save( {msg:jqXHR.responseText} );});
	};
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var click = function(b) {// синяя большая кнопка
		var f = $(b).closest('form');//.clone(true);
		//~ console.log('auth: ', auth,'; send:', send);
		if (auth && send) {
			//~ f.attr({target:'rainframe'}).submit();
			//~ console.log('serialize: ', f.serialize());
			$('#rainright').find('.check,.save').remove();
			$('#rainright').append('<div class="check"><span>Проверка...</span></div>').find('.err').empty();
			$.ajax({type: 'POST', url: f.attr('action'), dataType : "html", data: f.serialize()}).done(function(html) {avito_check(html)});
			send=0;
		} else if (! auth) {
			$('#rainright').html('<span style="color:red; font-weight:bold;">Нет же</span> <a target="_blank" href="' + url +'">авторизации</a>!');
		} else if(! send) {
			$('#rainright').html('<span style="color:red; font-weight:bold;">Проверка и сохранение выполняются...</span>');
		}
	};
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	var start = function(json) {
		//~ console.error(json);
		auth=json['auth'];
		if (document.referrer != url+'/') {return false;}
		var right = '';
		if (auth) {
			right=right+'Авторизация на <a target="_blank" href="' + url +'">сервисе</a> <span style="color:green; font-weight:bold;">успешно!</span> Заполните объявление и нажмите синюю кнопку Дождь слева. <span style="font-weight:bold;">Фотографии прикреплять на сайте Дождя.</span>';
			$('input[name="seller_name"]').val(json.data.agent_nam);
			$(':checkbox[name="allow_mails"]').prop('checked', true);//нельзя .prop('disabled', true);
			$('input[name="phone"]').val(json.data.agent_phone);
			$('input[name="email"]').val(json.data.email);// нельзя .prop('disabled', true);
		} else {
			right=right+'<span style="color:red; font-weight:bold;">Вы НЕ вошли, </span>'+'<a target="_blank" href="' + url +'">авторизуйтесь!</a>';
		}
		var rain = $('<div style="clear:both;">	<div id="btn-rain" class="package-label" style000="float:left; width:35%;">		<label for="pack1" class="package" style="border:1px solid blue; background-color:blue;"> 			<h3 style="font-size: 32px; text-align: center;">Дождь</h3>			<p class="package-about"><strong>Тысячи</strong> просмотров!</p>			<input type="radio" value="free" name="service_code" id="pack0" checked="checked" style="display: none;" />		</label>	</div>	<div id="rainright" style="margin-left: 33%; background-color: #ACF; padding: 1em; border-radius: 3px; "><div>'+right+'</div><hr /><ul class="err"></ul></div></div>');//
		$('#f_packages').before(rain);
		$('#btn-rain').click(function() { click(this); });
		//~ $("#rainframe").on("iframeloading iframeready iframeloaded iframebeforeunload iframeunloaded", function(e){console.log(e.type);});
	};
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	//~ var  = function() {
	//~ };
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	$.ajax({type: 'GET', url: url+'/auth', dataType : "json", xhrFields: {withCredentials: true},  crossDomain: true }).done(function(json) {start(json)});//headers:{'X-PINGOTHER':'pingpong', 'Content-Type':'application/xml'},
	//~ console.error(window.opener);
	//~ window.opener.location = window.opener.location;
	//~ console.log(window.parent);
	//~ if (window.parent) {window.parent.location.reload();}//




})();