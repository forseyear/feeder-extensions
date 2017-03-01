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
				object.css('width', object.data('orgWidth'));
				object.css('height', object.data('orgHeight'));
				break;
			
			case 'hide':
				object.data('orgOverflow', object.css('overflow'));
				object.data('orgMargin', object.css('margin'));
				object.data('orgWidth', object.css('width'));
				object.data('orgHeight', object.css('height'));
				object.css('overflow', 'hidden');
				object.css('margin', 0);
				object.css('width', 0);
				object.css('height', 0);
				break;
		}
	}
	var toggleAds = function(mode) {
		$('.admax-banner').each(function() {
			doaction($(this).parent(), mode);
		});
	};
	return {
		'constructor': function() {
			toggleAds('hide');
		},
		'destructor': function() {
			toggleAds('show');
		},
	};
});