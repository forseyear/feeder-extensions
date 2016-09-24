// テキストエリアを追加する拡張機能

(function(self, common, ext, fqon) {
	var orgPostFeed = window.postFeed;
	var modPostFeed = function() {
		// 書き込み内容の長さを取得
		var lengthSingle = $('#post_form_single').val().length;
		var lengthMulti = $('#post_form_multi').val().length;
		
		// 内容があれば投稿
		if (lengthSingle > 0) {
			activeForm = 'post_form_single'
			orgPostFeed();
			$('#post_form_single').val('');
		}
		if (lengthMulti > 0) {
			activeForm = 'post_form_multi';
			orgPostFeed();
			$('#post_form_multi').val('');
		}
		
		// 内容がなくても投稿
		if (lengthSingle == 0 && lengthMulti == 0) {
			orgPostFeed();
		}
		
		return;
	};
	
	return {
		'constructor': function() {
			window.postFeed = modPostFeed;
			var inactiveForm = (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
			$('#'+inactiveForm).css('display', 'inline');
			$('#'+inactiveForm).parent().css('display', 'inline');
			$('#input_type').parent().css('display', 'none');
			$('#post_form_single, #post_form_multi').on('focus.dualTextArea', function() {
				activeForm = $(this).attr('id');
			});
		},
		'destructor': function() {
			window.postFeed = orgPostFeed;
			var inactiveForm = (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
			$('#'+inactiveForm).css('display', 'none');
			$('#'+inactiveForm).parent().css('display', 'none');
			$('#input_type').parent().css('display', 'table-cell');
			$('#post_form_single, #post_form_multi').off('focus.dualTextArea');
		},
	};
});
