/// <reference types="cypress" />

const exp = require("constants");

describe('DeptTakeHome', () => {
    
    beforeEach(() => {
        cy.visit('https://www.weather.gov/')
        cy.request('GET', 'www.weather.gov').then(response => {
            expect(response.status).to.be.eq(200)
        })
        cy.url().should('include', 'weather.gov')
        cy.get('#inputstring').type('New York');
        cy.get('.autocomplete-suggestions [data-index]').contains('New York, FL, USA').click();

    })

    it('TC001 - valiadate url address',()=>{
        cy.url().should('include', '30').and('include', '87');
        cy.url().should('include', 'weather.gov');
    })

    it('TC002 - Validate Forcast Map values',()=>{
        const  mapValues = [
            'Select Basemap',
            'Topographic',
            'Streets',
            'Satellite',
            'Ocean'
        ];
        cy.wait(2000).get('#basemap-selected option').each(($el, index) => {
            cy.get("#basemap-selected").select(index).should('contain.text', mapValues[index])
        })
    })

    it('TC003 - valiadate extended Forecast Tumbnail', () => {
        cy.get(' .forecast-icon').each( ($el)=> {
            cy.get($el).should('have.css', 'height').and('eq', '86px');
            cy.get($el).should('have.css', 'width').and('eq', '86px');
        })
    })

    it('TC004 - validate forcast ', () => {
        cy.get('#current-conditions > .panel-heading').should('contain.text', 'Milton').and('contain.text', '30').and('contain.text', '87');
        cy.get('#current_conditions-summary').should('be.visible').should('contain.text', 'F').and('contain.text', 'C');
        cy.get('tbody tr td ').should('not.be.empty');
    })

    it('TC005 - validate extended forecast list', () => {
        cy.get('.temp').should('contain.text', 'High').and('contain.text', 'Low');
        cy.get('.period-name').then(($el) => {
            cy.get($el).its('length').should('be.equal', 9);
            cy.get($el).invoke('text').should('not.be.empty');
        })
    })

    it('TC006 - validate detailed forecast table',()=>{
        cy.get('#detailed-forecast').should('be.visible').should('not.be.empty');
        cy.get('#detailed-forecast b').its('length').should('be.gte', 1);
    })

    it('TC007 - validate more infromation links',()=>{
           const moreInfoLinks = [
            "More Local Wx",
            "3 Day History",
            "Mobile Weather",
            "Hourly Weather Forecast"
        ];

        moreInfoLinks.forEach(page => {
            cy.contains(page).then((link) => {
                cy.request(link.prop('href'));
            })
        })
    })

    it('TC008 - check for dead link in footer ',()=>{
          cy.get('.footer-legal a').each(($el) => {
            cy.log($el.attr('href'));
            cy.request($el.prop('href'));
        })
    })

    it('TC009 - Layout test', ()=> {
        const pages = ['macbook-15', 'ipad-2']
        pages.forEach(page => {
            cy.viewport(page);
            cy.get('.panel-title').each(($el)=>{
               cy.get($el).should('have.css', 'font-size', '16px');
            })
        })
    })
    it('TC010 - validate forcast Tumbnail', () => {
        cy.get('#current_conditions-summary img').then(($img) => {
            cy.get($img).should('have.css', 'height').and('eq', '100px');
            cy.get($img).should('have.css', 'width').and('eq', '100px');
        })
    })


    it('TC011 - Veryfiy Standard Radar page', () => {
        cy.contains('Additional Resources').scrollIntoView();
        cy.get('#radar img').first().then(($img) => {
            cy.get($img).should('have.css', 'height').and('eq', '120px');
            cy.get($img).should('have.css', 'width').and('eq', '150px');
        })
        cy.get('#radar').should('be.visible').within(() => {
            cy.get('a').first().then(($el) => {
                cy.request($el.prop('href'));
                cy.log($el.attr('href'));
                cy.visit($el.attr('href'));
            })
        }).then(() => {
            cy.url().should('include', 'radar').and('include', 'standard');
            cy.get('.banner').should('be.visible');
            cy.get('.title-product').should('include.text', 'Radar');
            cy.get('.message').should('not.be.empty').and('include.text', 'radar');
            cy.get('.controlFeature-auto').click();
            cy.get('.mapImages').should('have.css', 'height').and('eq', '550px');
            cy.get('.mapImages').should('have.css', 'width').and('eq', '600px');
            cy.get('.info a').each(($el) => {
                cy.log($el.attr('href'));
                cy.request($el.prop('href'));
            })
        })
    })

    it('TC012 - Veryfiy Enhanced KMOB Radar page', () => {
        cy.contains('Additional Resources').scrollIntoView();
        cy.get('#radar').should('be.visible').within(() => {
            cy.get('a').first().then(($el) => {
                cy.visit($el.attr('href'));
            })
        }).then(() => {
            cy.get('.message > a').click();
            cy.get('.ol-unselectable').should('have.css', 'width').and('eq', '1000px');
            cy.get('.ol-unselectable').should('have.css', 'height').and('not.eq', '660px');
        })
    })

    it('temp ',() =>{
        cy.get('.myforecast-current-lrg').invoke('text').then(parseInt)
        .then(($val)=>{
            expect($val).to.be.greaterThan(-10);
            expect($val).to.be.lessThan(120);
        })
    })
});
