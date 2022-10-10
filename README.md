# SurveyJS PDF Generator

[![Build Status](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_apis/build/status/SurveyJS%20Library?branchName=master)](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_build/latest?definitionId=7&branchName=master)
<a href="https://github.com/surveyjs/survey-pdf/issues">
<img alt="Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-pdf.svg">
</a>
<a href="https://github.com/surveyjs/survey-pdf/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed Issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-pdf.svg">
</a>

SurveyJS PDF generator allows saving an unlimited number of custom-built survey forms to PDF (both new and filled-in), and generate fillable PDF forms that your end users can edit. The PDF generator library surves as a client-side extension for the [SurveyJS Form Library](https://github.com/surveyjs/survey-library).

![Survey PDF Generator](docs/images/survey-pdf-export-overview.png)

### Features

- Support for all built-in SurveyJS Form Library question types
- Editable PDF forms
- Export of filled forms to PDF files
- Option to render a survey form as a PDF file for printing or downloading
- Automatic page breaks
- Markdown support
- Customizable page format and font
- Option to add a header and footer both on a page and an entire survey level
- An API to download a fillable survey form as a document file in a traditional PDF format
- PDF Form convertion to Blob, Base64 URL, or Raw PDF

## Get Started

- [Angular](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-angular)
- [Vue](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-vue)
- [React](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-react)
- [Knockout](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-knockout)
- [jQuery](https://surveyjs.io/Documentation/Pdf-Export?id=get-started-jquery)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Pdf-Export)
- [Live Examples](https://surveyjs.io/Examples/Pdf-Export)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS PDF Generator from Sources

1. **Clone the repo**

    ```
    git clone https://github.com/surveyjs/survey-pdf.git
    cd survey-pdf
    ```

1. **Install dependencies**          
Make sure that you have Node.js v6.0.0 or later and npm v2.7.0 or later installed.

    ```
    npm install
    ```

1. **Build the library**

    ```
    npm run build_prod
    ```

    You can find the built scripts and style sheets in the `survey-pdf` folder under the `packages` directory.

1. **Run test examples**

    ```
    npm start
    ```

    This command runs a local HTTP server at http://localhost:7777/.

1. **Run unit tests**

    ```
    npm test
    ```

## Licensing

SurveyJS PDF Generator is **not available for free commercial usage**. If you want to integrate it into your application, you must purchase a [commercial license](https://surveyjs.io/licensing) for software developer(s) who will be working with the SurveyJS product's APIs and implementing their integration.
