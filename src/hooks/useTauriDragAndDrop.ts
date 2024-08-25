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

import * as React from "react";
import { listen, TauriEvent } from "@tauri-apps/api/event";

type TauriDragAndDropPayload = {
    paths: string[];
    position: { x: number; y: number };
    id: number;
};

/**
 * Validates if the element id matches the specified element id start.
 * @param element The element to validate.
 * @param elementIdMatchStart The element id start to match.
 * @returns A value indicating whether the element id matches the specified element id start.
 **/
const elementIdMatches = (element: Element, elementIdMatchStart: string) => element.id.startsWith(elementIdMatchStart) || element.id === elementIdMatchStart;

/**
 * Enumerates the element parents.
 * @param element The element to enumerate.
 * @param depth The depth to enumerate.
 * @param elemets The elements from the previous depth.
 * @returns The element parents.
 **/
const enumerateElementParents = (element: Element | null | undefined, depth: number, elemets?: Element[]) => {
    if (depth === 0 || !element) {
        return elemets;
    }

    if (element.parentElement) {
        return enumerateElementParents(element.parentElement, depth - 1, [...(elemets ?? []), element]);
    }
    return elemets;
};

/**
 * Determines if any of the elements matches the specified element id start.
 * @param elements The elements to enumerate.
 * @param elementIdMatchStart The element id start to match.
 * @returns A value indicating whether any of the elements matches the specified element id start.
 **/
const foundAnyMatchingElement = (elements: (Element[] | null | undefined) | Element | null | undefined, elementIdMatchStart: string): boolean => {
    if (!elements) {
        return false;
    }

    if (Array.isArray(elements)) {
        const element = elements.filter(f => f !== null && f !== undefined).find(element => elementIdMatches(element, elementIdMatchStart));
        return element !== undefined && element !== null;
    } else {
        return elementIdMatches(elements, elementIdMatchStart);
    }
};

/**
 * Determines if the element or any of its parents are found on the point.
 * @param elementIdMatchStart The element id start to match.
 * @param position The position to check.
 * @param lookupDepth The lookup depth.
 * @returns A value indicating whether the element id is on the point.
 **/
const isElementIdOnPoint = (elementIdMatchStart: string, position: { x: number; y: number }, lookupDepth: number) => {
    const element = document.elementFromPoint(position.x, position.y);
    const elements = enumerateElementParents(element, lookupDepth);
    return foundAnyMatchingElement(elements, elementIdMatchStart);
};

const validateArraySingleItem = <T>(value?: T[] | T) => (Array.isArray(value) && value.length === 1 ? true : false);

enum DragDropState {
    Enter,
    Leave,
    Drop,
}

type DragDropEvent = (state: DragDropState, files?: string[] | undefined) => void;

const useTauriDragAndDrop = (listening: boolean, singleFileOnly: boolean, elementIdMatchStart: string, lookupDepth: number, onDragChange: DragDropEvent, onError?: (error: Error) => void) => {
    React.useEffect(() => {
        const unlistenPromise = listen<TauriDragAndDropPayload>(TauriEvent.DRAG_ENTER, event => {
            if (!listening) {
                return;
            }
            if (isElementIdOnPoint(elementIdMatchStart, event.payload.position, lookupDepth)) {
                onDragChange(DragDropState.Enter);
            } else {
                onDragChange(DragDropState.Leave);
            }
        });
        return () => {
            unlistenPromise
                .then(unlisten => {
                    unlisten();
                })
                .catch(error => {
                    onError?.(error);
                });
        };
    }, [elementIdMatchStart, listening, lookupDepth, onDragChange, onError, singleFileOnly]);

    React.useEffect(() => {
        const unlistenPromise = listen<TauriDragAndDropPayload>(TauriEvent.DRAG_LEAVE, () => {
            if (!listening) {
                return;
            }
            onDragChange(DragDropState.Leave);
        });
        return () => {
            unlistenPromise
                .then(unlisten => {
                    unlisten();
                })
                .catch(error => {
                    onError?.(error);
                });
        };
    }, [elementIdMatchStart, listening, lookupDepth, onDragChange, onError, singleFileOnly]);

    React.useEffect(() => {
        const unlistenPromise = listen<TauriDragAndDropPayload>(TauriEvent.DRAG_OVER, event => {
            if (!listening) {
                return;
            }

            if (isElementIdOnPoint(elementIdMatchStart, event.payload.position, lookupDepth)) {
                onDragChange(DragDropState.Enter);
            } else {
                onDragChange(DragDropState.Leave);
            }
        });
        return () => {
            unlistenPromise
                .then(unlisten => {
                    unlisten();
                })
                .catch(error => {
                    onError?.(error);
                });
        };
    }, [elementIdMatchStart, listening, lookupDepth, onDragChange, onError, singleFileOnly]);

    // Drop, this also causes the leave event
    React.useEffect(() => {
        const unlistenPromise = listen<TauriDragAndDropPayload>(TauriEvent.DRAG_DROP, event => {
            if (!listening) {
                return;
            }
            if (isElementIdOnPoint(elementIdMatchStart, event.payload.position, lookupDepth)) {
                if (singleFileOnly && validateArraySingleItem(event.payload.paths)) {
                    onDragChange(DragDropState.Drop, [event.payload.paths[0]]);
                    onDragChange(DragDropState.Leave);
                } else if (!singleFileOnly) {
                    onDragChange(DragDropState.Drop, event.payload.paths);
                    onDragChange(DragDropState.Leave);
                }
            }
        });
        return () => {
            unlistenPromise
                .then(unlisten => {
                    unlisten();
                })
                .catch(error => {
                    onError?.(error);
                });
        };
    }, [elementIdMatchStart, listening, lookupDepth, onDragChange, onError, singleFileOnly]);
};

export { useTauriDragAndDrop };
export type { DragDropEvent };
export { DragDropState };
