
class Blogger {

    youtube = false;

    #action = {
        bold: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "**" + sel.middle + "**" + sel.end;

            if (sel.selection.length === 0) {
                this.#editor.selectionEnd = sel.posStart + 2;
                return;
            }

            this.#parsePreview();
        },

        italic: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "*" + sel.middle + "*" + sel.end;

            if (sel.selection.length === 0) {
                this.#editor.selectionEnd = sel.posStart + 1;
                return;
            }

            this.#parsePreview();
        },

        code : (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "```\n" + sel.middle + "\n```" + sel.end;

            if (sel.selection.length === 0) {
                this.#editor.selectionEnd = sel.posStart + 4;
                return;
            }

            this.#parsePreview();
        },

        heading: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "# " + sel.middle + sel.end;

            if (sel.selection.length === 0) {
                this.#editor.selectionEnd = sel.posStart + 2;
            }

            this.#parsePreview();
        },

        list: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "* " + sel.middle + sel.end;

            this.#editor.selectionEnd = sel.posStart + 2;

            this.#parsePreview();
        },

        divider: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + "\n---\n" + sel.middle + sel.end;

            this.#editor.selectionEnd = sel.posStart + 5;

            this.#parsePreview();
        },

        link: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();

            if (sel.selection.length === 0) {
                this.#editor.value = sel.start + '[]()' + sel.end;
                this.#editor.selectionEnd = sel.posStart + 1;
            } else {
                this.#editor.value = sel.start + '[]('+ sel.middle + ')' + sel.end;
                this.#editor.selectionEnd = sel.posStart + 1;
            }

            this.#parsePreview();
        },

        image: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();

            if (sel.selection.length === 0) {
                this.#editor.value = sel.start + '![]()' + sel.end;
                this.#editor.selectionEnd = sel.posStart + 4;
            } else {
                this.#editor.value = sel.start + '![]('+ sel.middle + ')' + sel.end;
                this.#editor.selectionEnd = sel.posStart + 2;
            }

            this.#parsePreview();
        },

        quote: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();

            if (sel.selection.length === 0) {
                this.#editor.value = sel.start + '> ' + sel.end;
                this.#editor.selectionEnd = sel.posStart + 2;
            } else {

                let buffer = '';
                let str = sel.middle.split('\n');
                log(str);

                str.forEach((v) => {
                    buffer += `> ${v} \n`;
                });
                buffer += '\n';

                this.#editor.value = sel.start + buffer + sel.end;
                this.#editor.selectionEnd = sel.posStart + buffer.length;
            }

            this.#parsePreview();
        },

        youtube: (event = null) => {
            if (event) event.preventDefault();

            let sel = this.#selection();
            this.#editor.focus();
            this.#editor.value = sel.start + ":yt " + sel.middle + " yt:" + sel.end;

            if (sel.selection.length === 0) {
                this.#editor.selectionEnd = sel.posStart + 4;
                return;
            }

            this.#parsePreview();
        }

    };

    #editor;
    #toolbar;
    #preview;

    constructor(editor, toolbar, preview) {
        if (typeof marked === 'undefined') throw new Error('Marked dependency is missing.');
        if (typeof hljs === 'undefined') throw new Error('Highlight JS dependency is missing.');
        Blogger.#setupMarked();

        this.#editor = document.getElementById(editor);
        this.#toolbar = document.getElementById(toolbar);
        this.#preview = document.getElementById(preview);

        this.#addToolbar();
        this.#toolbarHook();

        // by default try to parse from the editor
        let value = this.#editor.value;
        if (value.length > 0) this.#parsePreview(value);

        this.#editor.addEventListener('keyup', () => this.#parsePreview());

        this.#editor.addEventListener('keydown', (e) => {

            let ctrl = e.ctrlKey;
            let key = e.key;

            if (key.toLowerCase() === 'tab') {
                this.#addTab(e);
                return;
            }

            if (!ctrl) return;

            switch (key) {
                case 'b':
                    this.#action['bold'](e);
                    break;

                case 'i':
                    this.#action['italic'](e);
                    break;

                case 'k':
                    this.#action['code'](e);
                    break;

                case 'h':
                    this.#action['heading'](e);
                    break;

                case 'l':
                    this.#action['list'](e);
                    break;

                case 'd':
                    this.#action['divider'](e);
                    break;

                case '.':
                    this.#action['link'](e);
                    break;

                case 'p':
                    this.#action['image'](e);
                    break;

                case 'q':
                    this.#action['quote'](e);
                    break;

                case 'y':
                    this.#action['youtube'](e);
                    break;
            }

        });
    }

    #addTab(event) {
        event.preventDefault();

        let sel = this.#selection();
        this.#editor.focus();
        this.#editor.value = sel.start + "    " + sel.end;

        this.#editor.selectionEnd = sel.start.length + 4;
    }

    #parsePreview() {
        let value = this.#editor.value;
        if (!this.youtube) {
            Blogger.#youtubeThumbnail();
            this.youtube = true;
        }
        this.#preview.innerHTML = marked.parse(value);
    }

    static parse(txt) {
        Blogger.#youtubeTag();
        return marked.parse(txt);
    }

    static lineNumbers() {
        hljs.highlightAll();
        hljs.initLineNumbersOnLoad();
    }

    #selection() {
        let output = {};
        let value = this.#editor.value;

        output["posStart"]  = this.#editor.selectionStart;
        output["posEnd"] = this.#editor.selectionEnd;

        output["selection"] = this.#editor.value.slice(this.#editor.selectionStart, this.#editor.selectionEnd);
        output["length"] = output["selection"].length;

        output["start"] = value.slice(0, output["posStart"]);
        output["middle"] = value.slice(output["posStart"], output["posEnd"]);
        output["end"] = value.slice(output["posEnd"]);

        return  output;
    }

    static #setupMarked() {
        marked.setOptions({
            pedantic: false,
            gfm: true,
            breaks: true,
            sanitize: true,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

        let renderer = {
            code(code) {
                return  `<pre><code class="hljs">${hljs.highlightAuto(code).value}</code></pre>`;
            }
        };
        marked.use({renderer});
    }

    static #youtubeTag() {
        let fn = (id) => {
            return `<iframe class="youtube" width="560" height="315" src="https://www.youtube.com/embed/${id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        };
        let extensionFn = Blogger.#ytRenderer(fn);
        marked.use({extensions: [extensionFn]});
    }

    static #youtubeThumbnail() {
        let fn = (id) => {
            return `<img alt="Youtube video" src="https://img.youtube.com/vi/${id}/0.jpg" />`;
        };
        let extensionFn = Blogger.#ytRenderer(fn);
        marked.use({extensions: [extensionFn]});
    }

    static #ytRenderer(decFn) {
        return {
            name: 'youtube',
            level: 'inline',
            start(src) { return src.match(/^:yt[^:\n]/)?.index; },
            tokenizer(src) {
                const rule = /^:yt([^:\n]+)yt:/;
                const match = rule.exec(src);
                if (match) {
                    const token = {
                        type: 'youtube',
                        raw: match[0],
                        text: match[1].trim(),
                        tokens: []
                    };
                    this.lexer.inline(token.text, token.tokens);
                    return token;
                }
            },
            renderer(token) {
                return decFn(this.parser.parseInline(token.tokens));
            }
        };
    }

    #toolbarHook() {
        for (let k in this.#action) {
            let dom = document.getElementById(k);
            dom.addEventListener('click', () => {
                this.#action[k]();
            });
        }
    }

    #addToolbar() {
        this.#toolbar.innerHTML = `
            <div class="jst-blogger-actions">
                <i id="bold"    class="material-icons" title="Bold (Ctrl+B)">format_bold</i>
                <i id="italic"  class="material-icons" title="Italic (Ctrl+I)">format_italic</i>
                <i id="heading" class="material-icons" title="Heading (Ctrl+H)">title</i> 
                <i id="divider" class="material-icons" title="Horizontal Rule (Ctrl+D)">horizontal_rule</i> 
                <i id="code"    class="material-icons" title="Code (Ctrl+K)">data_object</i>
                <i id="list"    class="material-icons" title="Bullet List (Ctrl+L)">format_list_bulleted</i>
                <i id="quote"   class="material-icons" title="Quotes (Ctrl+Q)">format_quote</i>
                <i id="link"    class="material-icons" title="Hyperlink (Ctrl+>)">link</i>
                <i id="image"   class="material-icons" title="Image (Ctrl+P)">image</i>
                <i id="youtube" class="material-icons" title="Youtube Video (Ctrl+Y)">smart_display</i>
            </div>        
        `;
    }

    markdown() {
        return this.#editor.value;
    }

}