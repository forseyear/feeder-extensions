// テキストエリアを追加する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('input', 'dualText', function() {
				var inactiveForm = (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
				if (activeForm != $('#'+inactiveForm).attr('id') && $('#'+inactiveForm).val().length > 0) {
					var orgActiveForm = activeForm;
					
					// 内容があれば投稿
					activeForm = inactiveForm;
					common.orgPostFeed();
					$('#'+activeForm).val('');
					
					activeForm = orgActiveForm;
					
					// 投稿したなら離脱する
					if ($('#'+activeForm).val().length == 0) {
						console.log('return')
						return;
					}
				}
			});
			var inactiveForm = (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
			$('#'+inactiveForm).css('display', 'inline');
			$('#'+inactiveForm).parent().css('display', 'inline');
			$('#input_type').parent().css('display', 'none');
			$('#post_form_single, #post_form_multi').on('focus.dualTextArea', function() {
				activeForm = $(this).attr('id');
			});
		},
		'destructor': function() {
			common.removeFilter('input', 'dualText');
			var inactiveForm = (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
			$('#'+inactiveForm).css('display', 'none');
			$('#'+inactiveForm).parent().css('display', 'none');
			$('#input_type').parent().css('display', 'table-cell');
			$('#post_form_single, #post_form_multi').off('focus.dualTextArea');
		},
	};
});
