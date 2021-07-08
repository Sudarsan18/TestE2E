export function addNewCustomer() {
    cy.server().route('post', '/api/sitecore/InstoreCustomer/*').as('customerRoutes')
    cy.get('.existing-customer-banner').should('be.visible');
    cy.get('.existing-customers').should('be.visible');
    cy.get('.new-customer').should('be.visible');
    cy.get('#new_customer_confirm_cta').should('be.visible').should('be.disabled');
    cy.get('#new-customer-radio').should('be.visible').click();
    cy.get('#new_customer_confirm_cta').should('be.visible').should('be.enabled').click();
    cy.wait('@customerRoutes').its('status').should('eq', 200);
    return;
}

export function fillAddCustomerForm() {
    cy.get('#first_name').should('be.visible').type('Tester');
    cy.get('#add_customer_cta').should('be.visible').should('be.disabled');
    
    cy.get('#last_name').should('be.visible').type('Tester');
    cy.get('#add_customer_cta').should('be.visible').should('be.disabled');
    
    cy.get('#email').should('be.visible').type('Tester@Tester.com');
    cy.get('#add_customer_cta').should('be.visible').should('be.enabled');
    
    cy.get('#phone').should('be.visible').type('781-555-1234');
    cy.get('#add_customer_cta').should('be.visible').should('be.enabled');
    
    cy.get('#zip_code').should('be.visible').type('02155');
    return;
}

export function cpcNoPayments() {
    if(Cypress.$('div.no-payment-container').length != 0) this.skip(); 
    return;
}  

export function cpcPayments() {
    if(Cypress.$('div.no-payment-container').length == 0) this.skip();
    return;
}

export function checkBuyNowCompletedStep(step, iconname) {
    cy.get('.leftRail .buy-now-navigation a').eq(step-1).find('div', '.dt-icon ' + iconname + ' ' + iconname + '-completed').should('exist');
    return;
}

export function checkCompletedStep(step) {
    cy.get('.leftRail .buy-now-navigation a').eq(step-1).find('.dt-icon-buy-now-completed').should('exist');
    return;
}


export function stopTesting() {
    if (this.currentTest.state === 'failed' && this.currentTest.currentRetry() === this.currentTest.retries()) {
        Cypress.runner.stop();
    }
    return;
}
