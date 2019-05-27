import { IQuestion, ItemValue, QuestionCheckboxBase, QuestionMatrixModel } from 'survey-core';
import { IPoint, IRect, DocController } from "../doc_controller";
import { FlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick'
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';
import { TextBrick } from '../pdf_render/pdf_text';

export abstract class FlatSelectBase extends FlatQuestion {
    protected question: QuestionCheckboxBase;
    public constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.question = <QuestionCheckboxBase>question;
    }

    public abstract createItemBrick(rect: IRect, item: ItemValue, index: number): IPdfBrick;
    private async generateFlatsItem(point: IPoint, item: ItemValue, index: number): Promise<IPdfBrick> {
        let compositeFlat: CompositeBrick = new CompositeBrick();
        let height: number = this.controller.measureText().height;
        let itemRect: IRect = SurveyHelper.createRect(point, height, height);
        compositeFlat.addBrick(this.createItemBrick(itemRect, item, index));
        let textPoint: IPoint = SurveyHelper.createPoint(itemRect, false, true);
        compositeFlat.addBrick(await SurveyHelper.createTextFlat(
            textPoint, this.question, this.controller, item.locText, TextBrick));
        if (item.value === this.question.otherItem.value) {
            compositeFlat.addBrick(SurveyHelper.createOtherFlat(
                SurveyHelper.createPoint(compositeFlat), this.question, this.controller, index));
        }
        return compositeFlat;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let colCount: number = this.question.colCount;
        if (this.question.colCount == 0) {
            colCount = Math.floor(SurveyHelper.getPageAvailableWidth(this.controller)
                / this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width);
        }
        else if (this.question.colCount > 1) {
            colCount = (SurveyHelper.getColumnWidth(this.controller, this.question.colCount) <
                this.controller.measureText(SurveyHelper.MATRIX_COLUMN_WIDTH).width) ? 1 : this.question.colCount;
        }
        return await (colCount == 1) ? this.generateVerticallyItems(point) : this.generateHorisontallyItems(point, colCount);

    }
    public async generateVerticallyItems(point: IPoint): Promise<IPdfBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let flats: IPdfBrick[] = [];
        for (let i: number = 0; i < this.question.visibleChoices.length; i++) {
            let itemFlat: IPdfBrick = await this.generateFlatsItem(
                currPoint, this.question.visibleChoices[i], i);
            currPoint.yTop = itemFlat.yBot;
            flats.push(itemFlat);
        }
        return flats;
    }
    public async generateHorisontallyItems(point: IPoint, colCount: number): Promise<IPdfBrick[]> {
        let currPoint: IPoint = SurveyHelper.clone(point);
        let flats: IPdfBrick[] = [];
        let row: CompositeBrick = new CompositeBrick();
        for (let i: number = 0; i < this.question.visibleChoices.length; i++) {
            this.controller.pushMargins(this.controller.margins.left, this.controller.margins.right);
            SurveyHelper.setColumnMargins(this.controller, i % colCount, colCount);
            currPoint.xLeft = this.controller.margins.left;
            let itemFlat: IPdfBrick = await this.generateFlatsItem(
                currPoint, this.question.visibleChoices[i], i);
            row.addBrick(itemFlat);
            this.controller.popMargins();
            if (i % colCount == colCount - 1 || i == this.question.visibleChoices.length - 1) {
                let rowLineFlat = SurveyHelper.createRowlineFlat(SurveyHelper.createPoint(row), this.controller);
                currPoint.yTop = rowLineFlat.yBot;
                flats.push(row, rowLineFlat);
                row = new CompositeBrick();
            }
        }
        return flats;
    }
}
