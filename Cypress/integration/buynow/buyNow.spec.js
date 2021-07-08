/// <reference types="Cypress" />
import { cpcNoPayments, cpcPayments, checkBuyNowCompletedStep, checkCompletedStep, stopTesting } from "../../support/common.js";

function makeString(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function makeNumber(length) {
   var result           = '';
   var characters       = '0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

var host = Cypress.env('ancomHost') || 'https://www2.qaautonation.com';

context('BuyNow Happy Path', () => {
    let vin = 'fail';
    before(function(){
        cy.clearCookies();
        // cy.visit(host + '/cars-for-sale?zip=33027');
        cy.visit(host);
    });

    //afterEach(function() {
        // if (this.currentTest.state === 'failed' && this.currentTest.currentRetry() === this.currentTest.retries()) {
        //   Cypress.runner.stop()
        // } 
    //});

    beforeEach(() => {       
        Cypress.Cookies.preserveOnce('ASP.NET_SessionId','__RequestVerificationToken','SiteViewType');
    });

    describe("Select a vehicle for BuyNow", () => {

        afterEach(function() {
            stopTesting.call(this);
        });

        it('should test typeahead search CTA to go to SRP', () => {
            cy.wait(2000).get('#js-typeahead-inventory')
                .should('be.visible')
                .clear()
                .type('Honda Accord',{ delay: 500 }).should('have.value', 'Honda Accord');
                cy.percySnapshot('sample');
            cy.get('#search-btn').click({ force: true }).wait(2000).url().should('include', 'cars-for-sale');
        });
    
        it('should successfully select a vehicle in SRP to go to VDP', () => {
            

            if(Cypress.$("div.modal").length > 0 && Cypress.$("div.modal").is(':visible') ){
                cy.get("i#btnUpdateZipCodeClose-close-x").should('be.visible').click();
            }
            cy.percySnapshot('test');
            cy.wait(2000).get("#input-stocktype-new-label").click({force: true}).wait(5000);
            cy.wait(2000).get("label[for='finance']").click({force: true}).wait(5000);
            // cy.wait(2000).get("span#panelLabel-fueltype").click({ force: true }).wait(2000);
            // cy.wait(2000).get("label[for='hy']").click({ force: true }).wait(5000);

            cy.get("a[id^='srp-tile-vdp-link-']")
            .its('length').should('be.gt', 0);
    
            cy.get("a[id^='srp-tile-vdp-link-']")
            .first({log: true})
            .should('have.attr', 'href')
            .then((href) => {
                let temp = href.split('/');
                vin = temp[temp.length - 1];
            }).get("a[id^='srp-tile-vdp-link-0']")
            .click()
            .then(() => {
                cy.url().should('include', vin);
            });        
        });
    
//         it('should click start purchase online CTA and navigate to Buy Now', () => {
//             if (Cypress.$(".buy-now-container a.primary-cta").is(':visible')) {
//                 cy.visit(host + '/buy-now/' + vin);
//             }else{
//                 Cypress.runner.stop();
//                 cy.screenshot();
//             }
//             // cy.get(".buy-now-container a.primary-cta")
//             // .should('be.visible').percySnapshot("VDP BuyNow CTA");

//             // cy.get(".buy-now-container a.primary-cta")
//             // .click()
//             // .then(() => {
//             //     cy.url().should('include', 'buy-now/personal-details');
//             // });           
//         });
//     });

//     describe("PersonalDetails", () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });
       
//         it('should close express modal or zipcode modal', () =>{
//             if (Cypress.$("button.primary-button").length > 0) {
//                 cy.get("button.primary-button").should('be.visible').click();
//               }else if(Cypress.$("div#BuyNowzipCodeModal").length > 0 && Cypress.$("div#BuyNowzipCodeModal").is(':visible') ){
//                 cy.get("span.close-x").should('be.visible').click({ multiple: true });
//               }else {
//                 // modal is not open
//               }   
//         });
    
//         it('should populate user details form and navigate to trade my car', () => {
//             cy.wait(2000)
//             var randomName = 'cypress' + makeString(8);
//             var randMI = makeString(1);
            
//             cy.get('[type="checkbox"]').should('exist').uncheck({force: true});

//             cy.percySnapshot("Personal Details");
            
//             cy.get('#first_name').should('be.visible').clear().type(randomName).should('have.value', randomName);
//             cy.get('#MiddleName').should('be.visible').clear().type(randMI).should('have.value', randMI);
//             cy.get('#lastNameId').should('be.visible').clear().type(randomName).should('have.length.gt', 0);
//             var randomeEmail = 'cypress' + makeString(9) + '@autonation.com';
//             var randomeNumber = makeNumber(11);
//             cy.get('input[formcontrolname="Email"]').clear({force: true}).should('be.visible').type(randomeEmail, {force: true}).should('have.value', randomeEmail);  
//             cy.get('#phone').should('be.visible').clear().type(randomeNumber, { delay: 500 }).should('have.length.gt', 0);
//             cy.get('#zip_code').should('be.visible').clear().type('33063').should('have.value', '33063'); 
//             cy.wait(3000);
//             cy.get('#next_cta').should('be.visible').click();
//             cy.wait(3000);
//         }); 

//     });

//     describe('PickupOrDelivery', () =>{
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url PickupOrDelivery step", function(){
//             cy.reloadStep(host, 'appointment');
//         });

//         it('should check PersonalDetails step completed', () => {
//             checkBuyNowCompletedStep(1, "personal-information-icon");
//         });
        
//         it('should enter lead zip', () => {
//             cy.get('#leadform-zipcode-')
//             .should('be.visible');

//             cy.get('#leadform-appointment-firstName-').clear().type('SOME');
//             cy.get('#leadform-appointment-LastName-').clear().type('NAME');
//             cy.get('#leadform-appointment-email-').clear().type('somename@autonation.com');
//             cy.get('#leadform-appointment-phone-').clear().type('33344455555', { delay: 500 });

//             cy.get('#leadform-zipcode-')
//             .clear()
//             .type('33063')
//             .should('have.value', '33063');

//             cy.percySnapshot("Pickup and Delivery Form");

//             cy.wait(3000);
//         });

//         it('should submit pickup delivery info', () => {
//             cy.get('.submitButton').should('be.visible').click();
//         });

//         it('should move to next', () => {

//             cy.get('[class="primary-cta medium-cta"]').should('be.visible').percySnapshot("Pickup and Delivery Confirmation");

//             cy.get('[class="primary-cta medium-cta"]')
//             .should('be.visible').click();
//         });

//    });

//     describe("SellMyCar", () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url sellmycar step", function(){
//             cy.reloadStep(host, 'sell-my-car');
//         });

//         it('should check PickupOrDelivery step completed', () => {
//             checkBuyNowCompletedStep(2, 'pickup-delivery-icon');
//         });

//         it('should be the sell my car module', () => {
//             cy.wait(5000);
//             cy.url().should('include', 'buy-now/sell-my-car');
//             cy.get('.range-offer-title').should('be.visible').percySnapshot("Sell My Car Step 1");
//         });  

//         it('should select a year from the dropdown', () => {
//             cy.get('#range-offer-year').should('be.visible').select('2002').should('have.value', '2002');
//         });

//         it('should succesfully select a make from dropdown', () => {
//             cy.get('#range-offer-make').should('be.visible').select('BMW');
//         });

//         it('should select a model from the dropdown', () => {
//             cy.get('#range-offer-model').should('be.visible').select('5-Series');
//         });

//         it('should succesfully set the trim', () => {
//             cy.get('#range-offer-trim').should('be.visible').select('540i');
//         });

//         it('should set the mileage to 1000', () => {
//             cy.get('#range-offer-mileage').should('be.visible').type('1000').should('have.value', '1,000');
//         });

//         it('Should successfully request an estimate', () => {
//             cy.wait(1000);
//             cy.get('#range-offer-getEstimate').should('be.visible').click({force: true});
//         });

//         it('should select yes for do you owe a balance', () => {
//             cy.get('[type="radio"]').should('exist').check('yes', {force: true});
//             cy.wait(1000);
//         });

//         it('should select buy for buy or lease', () => {
//             cy.get('[type="radio"]').should('exist').check('buy', {force: true});
//             cy.wait(1000);
//         });

//         it('should enter 1,000 for the estimate payoff', () => {
//             cy.get('input[formcontrolname="esitamteAmount"]').clear().type('1000').should('have.value', '1,000');
//         });

//         it('Should successfully provide payoff info for estimate', () => {
//             cy.wait(1000);
//             cy.get('#range-offer-getEstimate')
//             .should('be.visible').percySnapshot("Sell My Car Step 2");
//             cy.get('#range-offer-getEstimate').click();
//         });

//         it('should navigate to estimate page of sell my car', () => {
//             cy.wait(1000);
//             cy.get('.range-box-title').should('be.visible').percySnapshot("Sell My Car Step 3");
//         });

//         it('should populate appraisal value within min max range', () => {
//             cy.get('.text-left > .value').then(($field) => {
//                 var temp = $field.text()
//                 var lVal = parseInt(temp.replace(',','').replace(' ',''));
//                 cy.log($field.text())
//                 cy.get('[formcontrolname="Estimate"]').should('be.visible').clear().type(lVal + 1)
//             });
//         });

//         it('should have an estimate appraisal value', () => {
//             cy.wait(1000);      
//             cy.get('[formcontrolname="Estimate"]').should('have.length.greaterThan', 0);
//             cy.get('.trade-summary-value-text').should('have.length.greaterThan', 0);
//         });

//         it('should submit appraisal', () => {
//             cy.get('button[type="submit"]').contains('Next').click({force: true});
//         });

//         /* it('should check SellMyCar step completed', () => {
//             checkCompletedStep(3);
//         }); */ //Skip until defect have been resolved

//     });

//     describe("CalculatePayments", () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url CalculatePayments step", function () {
//             cy.reloadStep(host, 'payment-calculator');
//         });

//         it("should select cash tab", function(){
//             cy.get("div.cpc-container").then(function(){
//                 cpcNoPayments.call(this);
//                 cy.get('[aria-controls="panel1"]').click();
//             });
//         });

//         it("should select full details cash", function(){
//             cpcNoPayments.call(this);
//             cy.get('.price-breakdown-link').click();
//             cy.wait(2000);
//             cy.get('#pricebreakdownModal').should('not.be.empty');
//             cy.get('#pricebreakdownModal .close-x').click();
//         });

//         it("should select rebates", function(){
//             cpcNoPayments.call(this);
//             if(Cypress.$("div.payment-rebates").length != 0){
//                 cy.get('.payment-see-all').should('not.be.empty').click();
//                 cy.get('.rebate-incentive-container').should('not.be.empty');
//                 cy.get('ul rebate-item:first-child .tile-view-selected').should('not.be.empty').click();
//                 cy.get('.cta-section2 #next-cta').click();
//             }
//             else{
//                 cy.get('div.payment-rebates').should('have.length', 0); 
//             }    
//         });

//         it("should select trade in values cash", function(){
//             cpcNoPayments.call(this);
//             cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//             // cy.get('label[for=acc-checkTracein-cash]').should('be.visible').click();
//             cy.get('#tradeinAmt-cash').should('be.visible').clear().type(1000).should('have.value', 1000);
//             cy.get('#payOffAmt-cash').should('be.visible').clear().type(500).should('have.value', 500);
//             // cy.get('label[for= checkb-includeindeal-cash]').should('be.visible').click();
//             cy.wait('@getVehiclePayments');
//         });

//         it("should select cash payment option", function(){
//             cpcNoPayments.call(this);
//             cy.get('.cash-value').should('not.be.empty');
//              if (!Cypress.$('#cashPurchase').hasClass("on-select")) {
//                 cy.get('#cashPurchase').should('be.visible').click({ force: true });
//             }
//         });

//         it("should go to the cash comfirmation step", function(){
//             cpcNoPayments.call(this);
//             cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//             cy.get('.cta-section #next-cta').click();
//             cy.wait('@getVehiclePayments');
//             cy.get('.terms-container').should('be.visible');
//             cy.get('.terms-content').should('have.length.greaterThan', 0);
//             cy.wait(2000); 
//         });

//         // it("should go back to cpc option", function(){
//         //     cpcNoPayments.call(this);
//         //     cy.get('.cpc-cta-section #newappraisal-cta').click(); 
//         //     cy.wait(2000);
//         // });

//         // it("should select finance tab", function () {
//         //     cy.get("div.cpc-container").then(function () {
//         //         cpcNoPayments.call(this);
//         //         cy.get('[aria-controls="panel2"]').click();
//         //     });
//         // });

//         // it("should select cash due increment finance", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//         //     cy.get('.payment-options .subtitle-cash').should('be.visible').contains('Cash due');
//         //     cy.get('.payment-options .payment-amount #paymentCashDown-finance').should('be.visible').click().clear().type(1000).should('have.value', 1000);
//         //     cy.get('.payment-inputs .col-12:not(.hide) .payment-amt-section .payment-decrement .payment-inc').should('be.visible').click({ force: true });
//         //     cy.wait('@getVehiclePayments');
//         //     cy.get('.payment-options .payment-amount #paymentCashDown-finance').should('have.value', '1,500');
//         // });

//         // it("should select trade in values finance", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//         //     // cy.get('label[for=acc-checkTracein-finance]').should('be.visible').click();
//         //     cy.get('#tradeinAmt-finance').should('be.visible').clear().type(4000).should('have.value', 4000);
//         //     cy.wait(1000);
//         //     cy.get('#payOffAmt-finance').should('be.visible').clear().type(300).should('have.value', 300);
//         //     // cy.get('label[for= checkb-includeindeal-finance]').should('be.visible').click();
//         //     cy.wait('@getVehiclePayments');
//         // });

//         // it("should select credit score range finance", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//         //     cy.get('label[for=acc-check1-finance]').should('be.visible').click();
//         //     cy.get('.payment-inputs .col-12:not(.hide) .payment-credit-score .payment-credit:first-child').should('be.visible').click();
//         //     cy.wait('@getVehiclePayments');
//         // });

//         // it("should select cash due decrement finance", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//         //     cy.get('.payment-inputs .col-12:not(.hide) .payment-amt-section .payment-decrement .payment-dec').should('be.visible').click({ force: true });
//         //     cy.wait('@getVehiclePayments');
//         //     cy.get('.payment-options .payment-amount #paymentCashDown-finance').should('have.value', '1,000');
//         // });

//         // it("should select finance option", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.get('.scroll-container').should('be.visible');
//         //     if (!Cypress.$('.scroll-container > div:first-child .finance-total').hasClass("on-select")) {
//         //         cy.get('.scroll-container > div:first-child .finance-total').should('be.visible').click();
//         //     }
//         // });

//         // it("should go to the finance comfirmation step", function () {
//         //     cpcNoPayments.call(this);
//         //     cy.intercept('POST', '/api/sitecore/Payment/GetVehiclePayments').as('getVehiclePayments');
//         //     cy.get('.cta-section #next-cta').click();
//         //     cy.wait('@getVehiclePayments');
//         //     cy.get('.terms-container').should('be.visible');
//         //     cy.get('.terms-content').should('have.length.greaterThan', 2);
//         // });

//         it("should go to the next step", function () {
//             cpcNoPayments.call(this);
//             cy.get('.cpc-cta-section #next-cta').click();
//         });

//         // it("should go to the next step no-payment", function(){
//         //     cpcPayments.call(this);
//         //     cy.get('div.no-payment-container').should('be.visible');
//         //     cy.get('button.secondary-cta.buynow-move-next').should('be.visible').click();       
//         // });

//     });

//     describe("ProtectionPlans", () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url ProtectionPlans step", function () {
//             cy.reloadStep(host, 'protection-plans');
//         });

//         it("should select vehicle care program", () => {
//             cy.get('label[for="PM-protectionList"]').should('exist').click({ force: true }).percySnapshot("CFS Page");
//         });

//         it("should click go to the next step", () => {
//             cy.get('#protectionPlansNext').should('be.visible').wait(3000).click();
//         });

//     });

//     describe("ApplyForCredit", () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url ApplyForCredit step", function () {
//             cy.reloadStep(host, 'credit-application');
//         });

//         it('should check ProtectionPlans step completed', () => {
//             checkBuyNowCompletedStep(5, 'protection-plans-icon');
//         });

//         it("should enter dob", () => {
//             cy.get('#dob').should('be.visible').type("01/11/1981");
//         });

//         it("should enter ssn", () => {
//             cy.get('#ssn').should('be.visible').type("012450011");
//         });

//         it("should enter ssn confirm", () => {
//             cy.get('#SSNConfim').should('be.visible').type("012450011");
//         });

//         it("should click go to the residents info section", () => {
//             cy.get('#next_cta').should('be.visible').click();
//         });

//         it("should select housing type successfully", () => {
//             cy.get('#residence_type').should('be.visible').select('Own home outright');
//         });

//         it("should set monthly rent or mortgage", () => {
//             cy.get('#rent_or_mortgage_amt').clear().type('500').should('have.value', '500');
//         });

//         it("should set the address line 1", () => {
//             cy.get('#address1').should('be.visible').clear().type('111 first street');
//         });

//         it("should set the address line 2", () => {
//             cy.get('#address2').should('be.visible').clear().type('120');
//         });

//         it("should set the city", () => {
//             cy.get('#city').should('be.visible').clear().type('ft lauderdale');
//         });

//         it("should select FL as the state", () => {
//             cy.get('#state').should('be.visible').select('FL')
//         });

//         it("should set years at address", () => {
//             cy.get('#years_at_address').should('be.visible').select('10');
//         });

//         it("should set months at address to 10", () => {
//             cy.get('#months_at_address').should('be.visible').select('10');
//         });

//         it("should navigate to the employee info section", () => {
//             cy.get('#next_cta').should('be.visible').click();
//         });

//         it("should select employment status from dropdown", () => {
//             cy.get('#employment_status').should('be.visible').select('Full Time');
//         });

//         it("should select employment type from dropdown", () => {
//             cy.get('#employment_type').should('be.visible').select('Craftsman');
//         });

//         it("should set employer name", () => {
//             cy.get('#employer_name').should('be.visible').clear().type('ABC Co');
//         });

//         it("should set job title", () => {
//             cy.get('#job_title').should('be.visible').clear().type('Admin');
//         });

//         var randomNumber = makeNumber(10);
//         it("should set phone number", () => {
//             cy.get('#employer_phone').should('be.visible').clear().type(randomNumber,{ delay: 500 });
//         });

//         it("should select total years from dropdown", () => {
//             cy.get('#total_years').should('be.visible').select('10');
//         });

//         it("should select total months from dropdown", () => {
//             cy.get('#total_months').should('be.visible').select('10');
//         });

//         it("should set the gross annual salary", () => {
//             cy.get('#gross_salary').should('be.visible').clear().type('80000');
//             //cy.get('#income_frequency').should('be.visible').select('Yearly');
//             cy.get('#next_cta').should('be.visible').click();
//         });

//         it("should set additional income and set no co-buyer", () => {
//             cy.get('#additionalIncome').clear().type('1000').should('have.value', '1,000');
//             //cy.get('#IncomeFrequency').should('be.visible').select('Weekly');
//             cy.get('#IncomeSource').should('be.visible').select('Disability');

//             //cy.get('[type="radio"]').check('buy', {force: true});
//             cy.wait(1000);
//             cy.get('#next_cta').should('be.visible').click();
//         });

//         it("should enter user's full name for consent and submit", () => {
//             var ranName = makeString(6);
//             cy.get('#buyer').should('exist').clear({ force: true }).type(ranName);
//             cy.get('#next_cta').should('be.visible').click();
//         });

//         it("should be at credti application complete page", () => {
//             cy.get('.pqr-header > .title').should('not.be.empty');
//         });

//         it("should move to pickup or delivery module", () => {
//             cy.get('.w-100 > .primary-cta').should('be.visible').click();
//         });

//     });

//     describe('UploadDocuments', () => {
//         afterEach(function() {
//             stopTesting.call(this);
//             cy.screenshot();
//         });

//         it("should check url UploadDocuments step", function () {
//             cy.reloadStep(host, 'documents');
//         });

//         it('should check ApplyForCredit step completed', () => {
//             checkBuyNowCompletedStep(6, 'credit-application-icon');
//         });

//         it('should upload the doc', () => {
//             cy.fixture('e2eDocumentsUpload.png').as('upload');
//             cy.get('.document-upload-title').should('be.visible').percySnapshot("Document Upload");
//             cy.get('input[type=file]').then(function (el) {
//                 const blob = Cypress.Blob.base64StringToBlob(this.upload, 'image/png');
//                 const file = new File([blob], 'e2eDocumentsUpload.png', { type: 'image/png' });
//                 const list = new DataTransfer();
//                 list.items.add(file);
//                 const myFileList = list.files;
//                 el[0].files = myFileList;
//                 el[0].dispatchEvent(new Event('change', { bubbles: true }));
//             });
//         });

//         it('should delete the uploded doc', () => {
//             cy.get('#file-action-delete-0').should('be.visible').click();
//         });

//         it('should upload the an another doc', () => {
//             cy.fixture('e2eDocumentsUpload.png').as('upload');

//             cy.get('input[type=file]').then(function (el) {
//                 const blob = Cypress.Blob.base64StringToBlob(this.upload, 'image/png');
//                 const file = new File([blob], 'e2eDocumentsUpload.png', { type: 'image/png' });
//                 const list = new DataTransfer();
//                 list.items.add(file);
//                 const myFileList = list.files;
//                 el[1].files = myFileList;
//                 el[1].dispatchEvent(new Event('change', { bubbles: true }));
//             });
//         });

//         it("should click on next cta", () => {
//             cy.get('.w-100 > .primary-cta').should('be.visible').click();
//         });

//     });

//     describe('ReviewSummary', () => {
//         afterEach(function() {
//             stopTesting.call(this);
//         });

//         it("should check url ReviewSummary step", function () {
//             cy.reloadStep(host, 'summary');
//         });

//         it('should check UploadDocuments step completed', () => {
//             checkBuyNowCompletedStep(7, 'upload-documents-icon');
//         });

//         it('should show that personal details is completed', () => {
//             cy.get(':nth-child(3) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed')
//                 .should('be.visible').percySnapshot("Review Summary Page");
//         });

//         it('should show that pickup or delivery is completed', () => {
//             cy.get(':nth-child(4) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed')
//                 .should('be.visible');
//         });

//         it('should show that trade is completed', () => {
//             cy.get(':nth-child(5) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed')
//                 .should('be.visible');
//         });

//         it('should show payments section', () => {
//             cy.get(':nth-child(6) > .buy-sow-summary-accordion-header > .an-accordian-header')
//                 .should('be.visible');
//         });

//         it('should show that protection plans is completed', () => {
//             cy.get(':nth-child(7) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed')
//                 .should('be.visible');
//         });

//         it('should show that apply for credit is completed', () => {
//             cy.get(':nth-child(8) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed').scrollIntoView()
//                 .should('be.visible');
//         });

//         it('should show that documents is completed', () => {
//             cy.get(':nth-child(9) > .buy-sow-summary-accordion-header > .an-accordian-header .buynow-status-completed').scrollIntoView()
//                 .should('be.visible');
//         });

//         it('should click send to store', () => {
//             cy.get('#back_cta')
//                 .should('be.visible')
//                 .click();
//         });

//         it('should check ReviewSummary step completed', () => {
//             cy.wait(3000);
//             checkBuyNowCompletedStep(8, 'review-summary-icon');
//             cy.percySnapshot("Confirmation Page")
//         });
    });
});
