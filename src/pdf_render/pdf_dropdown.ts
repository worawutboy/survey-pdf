import { IQuestion, QuestionDropdownModel, ItemValue } from 'survey-core';
import { IRect, DocController } from '../doc_controller';
import { PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class DropdownBrick extends PdfBrick {
    protected question: QuestionDropdownModel;
    protected isQuestion: boolean;
    protected isMultiline: boolean;
    constructor(question: IQuestion,
        protected controller: DocController, rect: IRect) {
        super(question, controller, rect);
        this.question = <QuestionDropdownModel>question;
    }
    async render(): Promise<void> {
        let comboBox = new (<any>this.controller.doc.AcroFormComboBox)();
        comboBox.fieldName = this.question.id;
        comboBox.Rect = SurveyHelper.createAcroformRect(this);
        comboBox.edit = false;
        let options: string[] = new Array<string>();
        if (this.question.showOptionsCaption) {
            options.push(this.question.optionsCaption);
        }
        this.question.visibleChoices.forEach((item: ItemValue) => {
            options.push(item.value);
        });
        comboBox.setOptions(options);
        comboBox.value = '';
        if (!!this.question.renderedValue) {
            comboBox.value = this.question.renderedValue;
        }
        else if (this.question.showOptionsCaption) {
            comboBox.value = this.question.optionsCaption;
        }
        this.controller.doc.addField(comboBox);
    }
}