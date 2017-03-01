// 入力欄を統一する拡張機能

(function(self, common, ext, fqon) {
	var changeForm = function(formName, formValue, selectionIndex) {
		// 初期化&準備
		var changedForm = $('#' + formName);
		changedForm.val('');

		changedForm.css('display', 'inline-block');
		changedForm.val(formValue);
		changedForm[0].selectionStart = selectionIndex;
		changedForm[0].selectionEnd = selectionIndex;
		changedForm.focus();
		window.activeForm = formName;
	};

	return {
		'constructor': function() {
			// 準備
			$('#input_type').css('display', 'none');
			if (window.activeForm == 'post_form_multi') window.toggleInput();
			$('#post_form_single, #post_form_multi').attr('placeholder', '発言内容を入力（Enterで投稿  Shift + Enterで改行）');

			$('#post_form_single').off('keypress');
			$('#post_form_multi').off('keyup');
			// イベントを設定
			$('#post_form_single').on('keypress.dualTextArea', function(e) {
				if (e.keyCode == 13) {
					if (e.shiftKey) {
						// 改行準備
						var originalStr = $(this).val();
						var caretStart = $(this)[0].selectionStart;
						var caretEnd = $(this)[0].selectionEnd;
						var leftPart = originalStr.substr(0, caretStart);
						var rightPart = originalStr.substr(caretEnd, originalStr.length);

						// 改行する
						changeForm('post_form_multi', leftPart + '\n' + rightPart, caretStart + 1);

						// フォームを見えなくする
						$(this).css('display', 'none');
					} else {
						window.activeForm = 'post_form_single';
						window.postFeed.call(this);
					}
				}
			});
			$('#post_form_single').on('paste.dualTextArea', function(e){
				// 貼り付け準備
				var originalStr = $(this).val();
				var caretStart = $(this)[0].selectionStart;
				var caretEnd = $(this)[0].selectionEnd;
				var leftPart = originalStr.substr(0, caretStart);
				var rightPart = originalStr.substr(caretEnd, originalStr.length);
				// 貼り付けする
				var pasteData = e.originalEvent.clipboardData.getData('text');
				changeForm('post_form_multi', leftPart + pasteData + rightPart, caretStart + pasteData.length);

				// 後処理
				e.preventDefault();
				$('#post_form_single').css('display', 'none');
				// 改行コードがないときはフォームを戻す
				if ($('#post_form_multi').val().indexOf('\n') == -1) {
					changeForm('post_form_single', $('#post_form_multi').val(), $('#post_form_multi')[0].selectionStart);
					$('#post_form_multi').css('display', 'none');
				}
			});
			$('#post_form_multi').on('keyup.dualTextArea', function(e) {
				if (e.keyCode == 13) {
					if (!e.shiftKey) {
						window.activeForm = 'post_form_multi';
						window.postFeed.call(this);
						changeForm('post_form_single', '', 0);
						$(this).css('display', 'none');
					}
				}
				var height = Math.max(Math.min(($(this).val().split('\n').length) * 20, 240), 40);
				$(this).height(height);
			});
			$('#post_form_multi').on('keydown.dualTextArea', function(e) {
				if (e.keyCode == 13) {
					if (e.shiftKey) {
						appendText('post_form_multi', '\n');
					} else {
						return false;
					}
				}
			});
			$('#post_form_multi').on('input.dualTextArea', function() {
				// 改行コードがないときはフォームを戻す
				if ($(this).val().indexOf('\n') == -1) {
					changeForm('post_form_single', $(this).val(), $(this)[0].selectionStart);
					$(this).css('display', 'none');
				}
			});
		},
		'destructor': function() {
			// 元に戻す
			$('#input_type').css('display', 'table-cell');
			$('#post_form_single').attr('placeholder', '発言内容を入力（Enterで投稿）');
			$('#post_form_multi').attr('placeholder', '発言内容を入力（Shift + Enterで投稿）');

			// イベントも戻す
			$('#post_form_single, #post_form_multi').off('.dualTextArea');
			$('#post_form_single').on('keypress', function(e) {
				if (e.keyCode == 13) window.postFeed.call(this);
			});
			$('#post_form_multi').on('keyup', function(e) {
				if (e.keyCode == 13) {
					if (e.shiftKey) window.postFeed.call(this);
				}
				var height = Math.max(Math.min(($(this).val().split('\n').length) * 20, 240), 40);
				$(this).height(height);
			});
		},
	};
});
