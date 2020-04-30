import { IQuestion, QuestionImageModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from '../doc_controller';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatImage extends FlatQuestion {
    protected question: QuestionImageModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionImageModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let widthPt: number = SurveyHelper.parseWidth(
            this.question.imageWidth + 'px',
            SurveyHelper.getPageAvailableWidth(this.controller));
        let heightPt: number = SurveyHelper.parseWidth(
            this.question.imageHeight + 'px',
            SurveyHelper.getPageAvailableWidth(this.controller));
        return [await SurveyHelper.createImageFlat(point, this.question,
            this.controller, this.question.imageLink, widthPt, heightPt)];
    }
}

FlatRepository.getInstance().register('image', FlatImage);