
/* global React */
/* global ReactQuill */
import ReactQuill, { Quill } from 'react-quill';
import '../../override_styles/quill.snow.css';
import React from 'react';

if (typeof React !== 'object') {
    alert('React not found. Did you run "npm install"?');
}

if (typeof ReactQuill !== 'function') {
    alert('ReactQuill not found. Did you run "make build"?')
}

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "sans-serif",
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

var EMPTY_DELTA = { ops: [] };

function handle_attach() {
    const cursorPosition = this.quill.getSelection().index;
    this.quill.insertText(cursorPosition, "♥");
    this.quill.setSelection(cursorPosition + 1);
}

function handle_send() {
    alert(this.quill.getSelection())
}

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: 'snow',
            enabled: true,
            readOnly: false,
            value: EMPTY_DELTA,
            events: []
        };
    }

    formatRange(range) {
        return range
            ? [range.index, range.index + range.length].join(',')
            : 'none';
    }

    onEditorChange = (value, delta, source, editor) => {
        this.setState({
            value: editor.getContents(),
            events: [`[${source}] text-change`, ...this.state.events],
        });
    }

    onEditorChangeSelection = (range, source) => {
        this.setState({
            selection: range,
            events: [
                `[${source}] selection-change(${this.formatRange(this.state.selection)} -> ${this.formatRange(range)})`,
                ...this.state.events,
            ]
        });
    }

    onEditorFocus = (range, source) => {
        this.setState({
            events: [
                `[${source}] focus(${this.formatRange(range)})`
            ].concat(this.state.events)
        });
    }

    onEditorBlur = (previousRange, source) => {
        this.setState({
            events: [
                `[${source}] blur(${this.formatRange(previousRange)})`
            ].concat(this.state.events)
        });
    }

    onToggle = () => {
        this.setState({ enabled: !this.state.enabled });
    }

    onToggleReadOnly = () => {
        this.setState({ readOnly: !this.state.readOnly });
    }

    onSetContents = () => {
        this.setState({ value: 'This is some <b>fine</b> example content' });
    }

    bottom_toolbar() {
        return (
            <div id="toolbar">
                <select class="ql-font">
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="comic-sans">Comic Sans</option>
                    <option value="courier-new">Courier New</option>
                    <option value="georgia">Georgia</option>
                </select>
                <select class="ql-size">
                    <option value="small"></option>
                    <option selected></option>
                    <option value="large"></option>
                    <option value="huge"></option>
                </select>
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
                <select class="ql-color"></select>
                <select className="ql-align" />
                <button className="ql-list" value="ordered" />
                <button className="ql-direction" />
                <button className="ql-image" />
                <button className="ql-link" />
                <button className="ql-attach" > A </button>
                <button className="ql-send" > S </button>
            </div>
        )

    }

    render() {
        return (
            <div>
                {this.state.enabled && <ReactQuill
                    theme={this.state.theme}
                    value={this.state.value}
                    readOnly={this.state.readOnly}
                    onChange={this.onEditorChange}
                    onChangeSelection={this.onEditorChangeSelection}
                    onFocus={this.onEditorFocus}
                    onBlur={this.onEditorBlur}
                    modules={Editor.modules}
                />
                }
                {this.bottom_toolbar()}
            </div>
        );
    }

    renderToolbar() {
        var state = this.state;
        var enabled = state.enabled;
        var readOnly = state.readOnly;
        var selection = this.formatRange(state.selection);
        return (
            <div>
                <button onClick={this.onToggle}>
                    {enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={this.onToggleReadOnly}>
                    Set {readOnly ? 'read/Write' : 'read-only'}
                </button>
                <button onClick={this.onSetContents}>
                    Fill contents programmatically
        </button>
                <button disabled={true}>
                    Selection: ({selection})
        </button>
            </div>
        );
    }

    renderSidebar() {
        return (
            <div style={{ overflow: 'hidden', float: 'right' }}>
                <textarea
                    style={{ display: 'block', width: 300, height: 300 }}
                    value={JSON.stringify(this.state.value, null, 2)}
                    readOnly={true}
                />
                <textarea
                    style={{ display: 'block', width: 300, height: 300 }}
                    value={this.state.events.join('\n')}
                    readOnly={true}
                />
            </div>
        );
    }
}

var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

Editor.modules = {
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
    toolbar: {
        container: "#toolbar",
        handlers: {
            attach: handle_attach,
            send: handle_send
        }
    }
}
