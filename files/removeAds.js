// 広告を除去する拡張機能
// 警告されるまではいっかー　という考えのもと設置する

(function(self, common, ext, fqon) {
	var doaction = function(object, method) {
		if (!object || !object.size()) {
			return;
		}
		switch (method) {
			case 'show':
				object.css('overflow', object.data('orgOverflow'));
				object.css('margin', object.data('orgMargin'));
				object.css('padding', object.data('orgPadding'));
				object.css('width', object.data('orgWidth'));
				object.css('height', object.data('orgHeight'));
				break;
			
			case 'hide':
				object.data('orgOverflow', object.css('overflow'));
				object.data('orgMargin', object.css('margin'));
				object.data('orgPadding', object.css('padding'));
				object.data('orgWidth', object.css('width'));
				object.data('orgHeight', object.css('height'));
				object.css('overflow', 'hidden');
				object.css('margin', 0);
				object.css('padding', 0);
				object.css('width', 0);
				object.css('height', 0);
				break;
		}
	}
	var changeElements = function(method) {
		// 綺麗な方法ではないが、エラー対策
		switch (method) {
			case 'show':
				var usersFrameNext = $("#online_users_frame").next();
				$("#online_users_frame").insertBefore($("#feeder_links_frame")).append($("#online_users"));
				$("#feeder_links_frame").insertBefore(usersFrameNext).append($("#feeder_links"));
				break;
			
			case 'hide':
				var linksFrameNext = $("#feeder_links_frame").next();
				$("#feeder_links_frame").insertBefore($("#online_users_frame")).append($("#online_users"));
				$("#online_users_frame").insertBefore(linksFrameNext).append($("#feeder_links"));
				break;
		}
	}
	var toggleAds = function(mode) {
		// 上部の広告他
		for (var i=0; i<$('#wrapper').children().length; i++) {
			var e = $($('#wrapper').children().get(i));
			if (e.attr('id')) {
				break;
			}
			doaction(e, mode);
		}
		
		// 下部の広告
		if (!$('#footer').prev().attr('id')) {
			doaction($('#footer').prev(), mode);
		}
		
		// 右上の広告
		doaction($('#ad_square'), mode);
		
		// 右側の広告
		doaction($('#ad_skyscraper'), mode);
	};
	return {
		'constructor': function() {
			changeElements('hide');
			toggleAds('hide');
		},
		'destructor': function() {
			changeElements('show');
			toggleAds('show');
		},
	};
});