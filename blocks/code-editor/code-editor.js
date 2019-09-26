var Component = require('component');

function aceInitialize(obj, options, callback) {
    fastredRequire('frontend-var');

    require.ensure([], function(require) {
        var ace = require('brace');

        ace.define('ace/theme/code-editor', ['require', 'exports', 'module', 'ace/lib/dom'], function (acequire, exports, module) {
            exports.isDark = false;
            exports.cssClass = 'editor__content';
            exports.cssText = '';

            var dom = acequire('../lib/dom');
            dom.importCssString(exports.cssText, exports.cssClass);
        });

        var editor = ace.edit(obj);

        editor.setTheme('ace/theme/code-editor');
        editor.getSession().setMode('ace/mode/' + options.syntax);
        editor.getSession().setUseWrapMode(options.wordWrap);
        editor.renderer.setPadding(frontendVar('code-editor__padding_h'));
        editor.setOptions({
            showGutter: options.gutter,
            showPrintMargin: options.printMargin,
            minLines: frontendVar('code-editor__line-count_min'),
            maxLines: Infinity,
            fontSize: frontendVar('code-editor__font-size')
        });

        callback(editor);
    }, 'code-editor');
}

function CodeEditor() {
    fastredRequire('arr', 'frontend-var', 'template', 'var');

    this.template = 'code-editor';
    this.selector = '.code-editor';

    var CodeEditor = this;
    var $ = require('jquery');
    var selectors = {
        content: '.code-editor__content',
        textarea: '.code-editor__textarea'
    };
    var classes = {
        focused: 'code-editor_focused'
    };

    var Form = require('form');
    require('toolbar');
    require('code-editor/code-editor.css.styl');
    template(this.template, require('code-editor/code-editor.pug'));

    this.insert = function(component, value) {
        var editor = CodeEditor.editor(component);
        var cursor = editor.selection.getCursor();

        editor.insert(value);
    }

    this.editor = function(component) {
        return $(component).data('editor');
    };

    this.init = function(component) {
        var $component = $(component);
        var $content = $component.find(selectors.content);
        var $textarea = $component.find(selectors.textarea);

        var options = {
            syntax:         arrGetFound(frontendVar('code-editor__syntax'), $component.data('syntax'), 'text'),
            wordWrap:       varExists($component.data('word-wrap')),
            gutter:         varExists($component.data('gutter')),
            printMargin:    varExists($component.data('print-margin'))
        };

        // Initialize Ace editor and return
        aceInitialize($content.get(0), options, function(editor) {
            $component.data('editor', editor);

            editor.on('focus', function() {
                $component.addClass(classes.focused);
            });

            editor.on('blur', function() {
                $component.removeClass(classes.focused);
            });

            $component.focus(function() {
                editor.focus();
            });
        });

        // Copy text to hidden textarea on parent form submit
        // to be able to send text with other form data
        $textarea.closest('form').on('submit ' + Form.events.submit, function() {
            $textarea.val(CodeEditor.value(component));
        });
    };

    this.value = function(component) {
        var editor = CodeEditor.editor(component);

        if (editor) {
            return editor.getSession().getValue();
        }

        return null;
    };

    Component.register(this);
}

CodeEditor.prototype = Component;

module.exports = new CodeEditor();