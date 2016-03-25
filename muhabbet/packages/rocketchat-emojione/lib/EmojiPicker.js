/* globals emojione, Blaze, Template */
RocketChat.EmojiPicker = {
	width: 390,
	height: 203,
	initiated: false,
	input: null,
	source: null,
	recent: [],
	tone: null,
	opened: false,
	pickCallback: null,
	init() {
		if (this.initiated) {
			return;
		}
		this.initiated = true;

		this.recent = window.localStorage.getItem('emoji.recent') ? window.localStorage.getItem('emoji.recent').split(',') : [];
		this.tone = window.localStorage.getItem('emoji.tone') || 0;

		Blaze.render(Template.emojiPicker, document.body);

		$(document).click((event) => {
			if (!this.opened) {
				return;
			}
			if(!$(event.target).closest('.emoji-picker').length && !$(event.target).is('.emoji-picker')) {
				if (this.opened) {
					this.close();
				}
			}
		});

		$(window).resize(_.debounce(() => {
			if (!this.opened) {
				return;
			}
			this.setPosition();
		}, 300));
	},
	isOpened() {
		return this.opened;
	},
	setTone(tone) {
		this.tone = tone;
		window.localStorage.setItem('emoji.tone', tone);
	},
	getTone() {
		return this.tone;
	},
	getRecent() {
		return this.recent;
	},
	setPosition() {
		let sourcePos = $(this.source).offset();
		let left = (sourcePos.left - this.width + 50);
		let top = (sourcePos.top - this.height - 10);

		if (left < 0) {
			left = 10;
		}
		if (top < 0) {
			top = 10;
		}

		return $('.emoji-picker')
			.css({
				top: top + 'px',
				left: left + 'px'
			});
	},
	open(source, callback) {
		if (!this.initiated) {
			this.init();
		}
		this.pickCallback = callback;
		this.source = source;

		this.setPosition().addClass('show');

		this.opened = true;
	},
	close() {
		$('.emoji-picker').removeClass('show');
		this.opened = false;
	},
	pickEmoji(emoji) {
		this.pickCallback(emoji);

		this.close();
		this.addRecent(emoji);
	},
	addRecent(emoji) {
		let pos = this.recent.indexOf(emoji);

		if (pos !== -1) {
			this.recent.splice(pos, 1);
		}

		this.recent.unshift(emoji);

		window.localStorage.setItem('emoji.recent', this.recent);

		this.updateRecent();
	},
	updateRecent() {
		let total = this.recent.length;
		var html = '';
		for (var i = 0; i < total; i++) {
			let emoji = this.recent[i];
			let tone = '';

			html += '<li class="emoji-' + emoji + '" data-emoji="' + emoji + '">' + emojione.toImage(':' + emoji + tone + ':') + '</li>';
		}
		$('.recent.emoji-list').html(html);
	}
};
