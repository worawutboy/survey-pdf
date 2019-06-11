import { IElement, IQuestion, PanelModelBase, PanelModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatRepository } from './flat_repository';
import { IFlatQuestion } from './flat_question';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { RowlineBrick } from '../pdf_render/pdf_rowline';
import { SurveyHelper } from '../helper_survey';

export class FlatSurvey {
    public static async generateFlatsPanel(point: IPoint,
        question: PanelModel, controller: DocController): Promise<IPdfBrick[]> {
        let panelFlats: IPdfBrick[] = [];
        let panelContentPoint: IPoint = { xLeft: point.xLeft, yTop: point.yTop };
        if (!!question.title) {
            let panelTitleFlat: IPdfBrick = await SurveyHelper.createTitlePanelFlat(
                panelContentPoint, null, controller, question.title);
            let compositeFlat: CompositeBrick = new CompositeBrick(panelTitleFlat);
            panelContentPoint = SurveyHelper.createPoint(panelTitleFlat);
            if (!!question.description) {
                let panelDescFlat: IPdfBrick = await SurveyHelper.createDescFlat(
                    panelContentPoint, null, controller,
                    question.locDescription);
                compositeFlat.addBrick(panelDescFlat);
                panelContentPoint = SurveyHelper.createPoint(panelDescFlat);
            }
            panelFlats.push(compositeFlat);
        }
        controller.pushMargins();
        controller.margins.left += controller.measureText(question.innerIndent).width;
        panelContentPoint.xLeft += controller.measureText(question.innerIndent).width;
        panelFlats.push(...await this.generateFlatsPagePanel(panelContentPoint, question, controller));
        controller.popMargins();
        return panelFlats;
    }
    private static async generateFlatsPagePanel(point: IPoint,
        pagePanel: PanelModelBase, controller: DocController): Promise<IPdfBrick[]> {
        if (!pagePanel.isVisible) return;
        
        pagePanel.onFirstRendering();
        let pagePanelFlats: IPdfBrick[] = [];
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (let row of pagePanel.rows) {
            if (!row.visible) continue;
            let width: number = SurveyHelper.getPageAvailableWidth(controller);
            controller.pushMargins();
            let currMarginLeft: number = controller.margins.left;
            let rowFlats: IPdfBrick[] = [];
            let visibleCount: number = (<any>row)['getVisibleCount']();
            for (let i: number = 0; i < row.elements.length; i++) {
                let element: IElement = row.elements[i];
                if (!element.isVisible) continue;
                let persWidth: number = SurveyHelper.parseWidth(element.renderWidth, width);
                controller.margins.left = currMarginLeft;
                controller.margins.right = controller.paperWidth - currMarginLeft - persWidth;
                if (i != visibleCount - 1) {
                    controller.margins.right += controller.measureText().width / 2.0;
                }
                currMarginLeft = controller.paperWidth - controller.margins.right +
                    controller.measureText().width;
                currPoint.xLeft = controller.margins.left;
                if (element instanceof PanelModel) {
                    rowFlats.push(...await this.generateFlatsPanel(currPoint, element, controller));
                }
                else {
                    let flatQuestion: IFlatQuestion =
                        FlatRepository.getInstance().create(<IQuestion>element, controller);
                    rowFlats.push(...await flatQuestion.generateFlats(currPoint));
                }

            }
            controller.popMargins();
            currPoint.xLeft = controller.margins.left;
            if (rowFlats.length !== 0) {
                currPoint.yTop = SurveyHelper.mergeRects(...rowFlats).yBot;
                currPoint.xLeft = point.xLeft;
                currPoint.yTop += controller.measureText().height;
                pagePanelFlats.push(...rowFlats);
                pagePanelFlats.push(SurveyHelper.createRowlineFlat(currPoint, controller));
                currPoint.yTop += SurveyHelper.EPSILON;
            }
        }
        return pagePanelFlats;
    }
    private static popRowlines(flats: IPdfBrick[]) {
        while (flats.length > 0 && flats[flats.length - 1] instanceof RowlineBrick) {
            flats.pop();
        }
    }
    public static async generateFlats(survey: SurveyPDF): Promise<IPdfBrick[][]> {
        let flats: IPdfBrick[][] = [];
        for (let page of survey.visiblePages) {
            let pageFlats: IPdfBrick[] = [];
            pageFlats.push(...await this.generateFlatsPagePanel(
                survey.controller.leftTopPoint, page, survey.controller));
            flats.push(pageFlats);
            this.popRowlines(flats[flats.length - 1]);
        }
        return flats;
    }
}