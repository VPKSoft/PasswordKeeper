/*
MIT License

Copyright (c) 2024 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * An enumeration of the mode an entry / category is being edited in.
 */
export enum ModifyType {
    /** The entry is new. */
    New,
    /** The entry is an existing one. */
    Edit,
}

/**
 * An enumeration for a file open or save query mode.
 */
export enum FileQueryMode {
    /** A file is being opened. */
    Open,
    /** An existing file is being saved. */
    Save,
    /** An existing file is being saved with a new name. */
    SaveAs,
}

/**
 * An enumeration of the button clicked in a popup with onClose: (result: DialogResult) callback.
 */
export enum DialogResult {
    /** The yes button was selected. */
    Yes,
    /** The no button was selected. */
    No,
    /** The cancel button was selected. */
    Cancel,
}

/**
 * An enumeration for buttons to display in a popup.
 */
export enum DialogButtons {
    /** Display a yes button. */
    Yes = DialogResult.Yes,
    /** Display a no button. */
    No = DialogResult.No,
    /** Display a cancel button. */
    Cancel = DialogResult.Cancel,
}

/**
 * An enumeration for a popup type for the {@link ConfirmPopup} and other popups.
 */
export enum PopupType {
    /** The popup is a confirmation popup. */
    Confirm,
    /** The popup is an information popup. */
    Information,
    /** The popup is a warning popup. */
    Warning,
}
