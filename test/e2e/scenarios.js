'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser.get('app/index.html');
  });

  it('should start at the Bookmarks page', function() {
  	expect(browser.getTitle()).toEqual('Locksmith');
  	expect(element(by.id('title')).getText()).toEqual('Bookmarks');
  });

});