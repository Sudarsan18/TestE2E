// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//import '@percy/cypress';

Cypress.Commands.add('login', (baseURL) => {
    cy.fixture('urls').then((urls) => {
        if (baseURL != urls.dev) {
            cy.clearCookies();
            cy.visit(baseURL + "/login");
            cy.fixture('login').then((login) => {
                cy.get('#instore-signin-username').type(login.email);
                cy.get('#instore-signin-password').type(login.pass);
                cy.get('#instore-button-form-login').click();
                cy.waitSpinner();
                cy.get('#instore-signin-store').select(login.hyperionId);
                cy.waitSpinner();
                cy.get('#instore-continue-button').should('be.visible').click({force: true});
            });
        }
    })
})

Cypress.Commands.add('searchCustomer', (search_value) => {
    cy.get('#search_input')
      .should('be.visible')
      .type(search_value, {
          delay: 300
      }).wait(500);
    return cy.get('#customer_search_cta')
      .should('be.visible').click();
})

Cypress.Commands.add('getLoader', (loader) => {
    return cy.get(loader + ' .ngx-progress-bar');
})

Cypress.Commands.add('waitLoaderSRP', (loader) => {
    cy.getLoader(loader).then((loaderTop) => {
        if (Cypress.$(loaderTop[0]).hasClass("loading-foreground")) {
            cy.wait(500);
            cy.waitLoaderSRP(loader);
        }
    })
})

Cypress.Commands.add('waitSpinner', () => {
    cy.get('#instore-spinner').then((spinner) => {
        if (!Cypress.$(spinner[0]).hasClass("instore-hidden")) {
            cy.wait(500);
            cy.waitSpinner(spinner);
        }
    })
})

/**
 * Go to "Vehicle Search" step
 */
Cypress.Commands.add('goVehicleSearch', (customerName) => {
    cy.location().then((loc) => {
        cy.fixture('urls').then((urls) => {
            if (loc.origin != urls.dev) {
                cy.searchCustomer(customerName);
                cy.get('#customer_search_cta').click();
                cy.waitLoaderSRP('#ngx-loader-top');
                cy.get('.an-search-result-container')
                  .find('.an-search-result-body')
                  .find('.an-search-result-row')
                  .as('searchResult')
                ;
                cy.get('@searchResult').first()
                  .find('.radio')
                  .click()
                ;
                cy.get('#existing_customer_confirm_cta').click();

                cy.getLoader('#ngx-loader-top').then((loader) => {
                    if (Cypress.$(loader[0]).hasClass("loading-foreground")) {
                        console.log('Landed on "Car for Sale"');
                    } else {
                        console.log('Show "Log Visit" modal');
                        cy.get('#log-visit-no-cta').click();
                    }
                });
            }
        })
    })
})

Cypress.Commands.add('reloadStep', (host, path) => {
    cy.url().then((url) => {
        if(!url.includes(`/buy-now/${path}`)){
            let vin = url.split('/').pop();
            cy.visit(host + `/buy-now/${path}/${vin}`);
        }
    })
    cy.url().should('include', `/buy-now/${path}`);
})

/*
    Ref: https://docs.cypress.io/api/cypress-api/custom-commands.html#Child-Commands
    Add this to /cypress/support/commands.js
  */
    Cypress.Commands.add('onFail', { prevSubject: true }, (chainedSubject, data) => {
        cy.on('fail', (error, runnable) => {
          error.name = data.title
          error.message = data.title + ': ' + error.message
          throw error // throw error to have test still fail
        })
        return chainedSubject
      })
