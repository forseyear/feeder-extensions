// 引用中の引用を展開できるようにする拡張機能

(function(self, common, ext, fqon) {
	return {
		'expand': function(element, from, target) {
			var $element = $(element);
			var originalHtml = $element.html();
			
			// 読み込み中の表示にする
			$element.html(
				$('<img/>')
					.attr('src', common.loadingImage)
			);
			
			// モバイルページから投稿を取得して
			$.get('mobile/?v_id=' + target, function(mobilePage) {
				var pageElements = $(mobilePage).find('body').html().replace(/\sxmlns=\"http\:\/\/www\.w3\.org\/1999\/xhtml\"/g, '').replace(/^.*?<br\s\/>/, '');

				// エラーが出ないようにする
				var referenceHtml = document.createElement('div');
				referenceHtml.innerHTML = pageElements;

				// ページから必要な情報を抜き出す
				var nameHTML = referenceHtml.innerHTML.replace(/(^.*?)\s?<span.*$/i, '$1');
				// HTMLからアバターを置き換える
				var name = nameHTML.replace(/<.*?alt=\"([^\"].*?)\".*?>/g, '$1');
				var dataHTML = referenceHtml.innerHTML.replace(/^.*?<div.*?>(.*?)<div.*$/, '$1');
				// HTMLから引用タグを置き換える
				var data = dataHTML.replace(/<a.*?.\?v_id=(\d+).*?(&gt;&gt;\d+).*?<\/a>/g, '<a class="clickable" onclick="'+fqon+'.expand(this, '+target+', $1)">$2</a>');

				// 引用部分を作成
				var quote = '<table class="ref"><tbody><tr><td colspan="2">'+name+'<br>'+data+'</td></tr><tr><td><span class="feed_id">'+target+'</span></td><td class="align_r"><a class="clickable" onclick="jumpToFeed('+target+'); return false;">この投稿へジャンプ→</a></td></tr></tbody></table>';

				// モバイルアイコンから戻す
				setTimeout(function() {
					changeStatus($('#my_status_icn').attr('src').charAt(17));
				}, 200);

				// なければリンクを無効化して元に戻す
				if (referenceHtml.childNodes[0].innerText === '該当の投稿は削除されたか、存在しません') {
					$element.after(originalHtml).remove();
					return;
				}

				// 表示
				$element.after(quote).remove();
			});
		},
		'constructor': function() {
			// フィルタ関数登録
			common.addFilter('output', 'expandNestedQuotes', function(entries, skelton) {
				entries.forEach(function(entry, index, array) {
					// まず引用を抜き出して
					array[index][5] = entry[5].replace(/<table class="ref">[\s\S]+?<span class="feed_id">(\d+)<\/span>[\s\S]+?<\/table>/g, function(all, from) {
						// そこから更にその中の引用を抜き出す
						return all.replace(/&gt;&gt;(\d+)/g, function(tag, target) {
							// 対象が存在しないIDならリンクにしない
							if (common.roomInfo.latestEntryId > 0 && target > common.roomInfo.latestEntryId + 1) return tag;
							// リンク化
							return '<a class="clickable" onclick="'+fqon+'.expand(this, '+from+', '+target+')">' + tag + '</a>';
						});
					});
				});
				return entries;
			});
			var orgOpenNote = window.openNote;
			window.openNote = function(index) {
				orgOpenNote(index);
				setTimeout(function() {
					$('#sub_note_contents').find('.ref').each(function() {
						var from = $(this).find('tr td span.feed_id').text();
						var ref = $(this).find('tr td:eq(0)').html().replace(/&gt;&gt;(\d+)/g, '<a class="clickable" onclick="'+fqon+'.expand(this, '+from+', $1)">&gt;&gt;$1</a>');
						$(this).find('tr td:eq(0)').html(ref);
					});
				}, 300);
			}
			var orgViewMessages = window.viewMessages;
			window.viewMessages = function(type) {
				orgViewMessages(type);
				setTimeout(function() {
					$('#message_view').find('.ref').each(function() {
						var from = $(this).find('tr td span.feed_id').text();
						var ref = $(this).find('tr td:eq(0)').html().replace(/&gt;&gt;(\d+)/g, '<a class="clickable" onclick="'+fqon+'.expand(this, '+from+', $1)">&gt;&gt;$1</a>');
						$(this).find('tr td:eq(0)').html(ref);
					});
				}, 600);
			}
		},
		'destructor': function() {
			// フィルタ関数登録解除
			common.removeFilter('output', 'expandNestedQuotes');
			window.openNote = orgOpenNote;
			window.viewMessages = orgViewMessages;
		},
	};
});
