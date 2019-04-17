import { IRect } from '../docController';
import { IQuestion } from 'survey-core';
import { PdfText } from './pdf_text';

export class PdfTitle extends PdfText {
    constructor(question: IQuestion, rect: IRect) {
        super(question, rect);
    }
    render(): void {

    }
}