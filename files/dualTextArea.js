// テキストエリアを追加する拡張機能
// コードの一部がよくわからないけど予想通りの動きをするのでこのままにしておく

(function(self, common, ext, fqon) {
	var orgPostFeed = window.postFeed;
	var inactiveForm = function() {
		return (activeForm == 'post_form_multi') ? 'post_form_single' : 'post_form_multi';
	};
	var inactiveFormDisplay = function(value) {
		$('#'+inactiveForm()).css('display', value);
		$('#'+inactiveForm()).parent().css('display', value);
	};
	var modToggleInput = function () {
		// 書き込み内容取得
		var contentSingle = $('#post_form_single').val();
		var contentMulti = $('#post_form_multi').val();
		
		// オリジナルの関数を呼び出す
		toggleInput();
		
		// アクティブでないフォームを表示する
		inactiveFormDisplay('inline');
		
		// 書き込み内容復元
		$('#post_form_single').val(contentSingle);
		$('#post_form_multi').val(contentMulti);
	};
	var modPostFeed = function() {
		// 戻り値を宣言
		var result;
		
		// 書き込み内容取得
		var contentActive = $('#'+activeForm).val();
		var contentInactive = $('#'+inactiveForm()).val();
		
		// オリジナルの関数を呼び出す
		if (contentActive.length > 0) {
			result = orgPostFeed.call(this);
			$('#'+activeForm).val('');
		}
		
		// アクティブでないフォームの書き込み内容復元
		// $('#'+inactiveForm()).val(contentInactive);
		
		// 書き込みがあれば投稿
		if (contentInactive.length > 0) {
			modToggleInput();
			result = orgPostFeed.call(this);
			$('#'+activeForm).val('');
		}
		
		return result;
	};
	
	return {
		'constructor': function() {
			inactiveFormDisplay('inline');
			$('#input_type').parent().css('display', 'none');
			window.postFeed = modPostFeed;
		},
		'destructor': function() {
			inactiveFormDisplay('none');
			$('#input_type').parent().css('display', 'table-cell');
			window.postFeed = orgPostFeed;
		},
	};
});
