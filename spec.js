// spec.js
describe('angularjs todo', function() {
 
  // controls descriprion
  var newTodo = element(by.model('newTodo'));
  var listElements = element.all(by.repeater('todo in todos'));
  var firstLabel = listElements.first().element(by.tagName('label'));
  var firstInput = listElements.first().element(by.model('todo.title'));
  var firstDelete = listElements.first().element(by.tagName('button'));
  var counter = element(by.id('todo-count')).element(by.tagName('strong'));
  var counterText = element(by.id('todo-count')).element(by.tagName('ng-pluralize'));
  var toggleAll = element(by.id('toggle-all'));
  var clearCompleted = element(by.id('clear-completed'));
  var filterAll = element(by.xpath('//*[@id="filters"]/li[1]/a'));
  var filterActive = element(by.xpath('//*[@id="filters"]/li[2]/a'));
  var filterCompleted = element(by.xpath('//*[@id="filters"]/li[3]/a'));

  // helper methods
  function createTodo(textTodo) {
  	newTodo.sendKeys(textTodo);    
    newTodo.sendKeys(protractor.Key.ENTER);
  };
  function deleteTodo(labelTodo, deleteButton) {
     browser.actions().mouseMove(labelTodo).perform();
     deleteButton.click();
  };
    
  // tests
  beforeEach(function() {
    browser.get('http://todomvc.com/examples/angularjs');
  });
 
  it('should not create empty todo', function() {
  	newTodo.sendKeys(protractor.Key.ENTER);
  	expect(listElements.count()).toBe(0);
  });
  it('should handle long todos', function() {
  	createTodo('JNA7aL0acuGQq8voG##JR2%2EkvVwuJxY#JiFAYP H#ItYhsmK45k7LJKEMq6tkHpgpA9jYx 1QWXyeMsM87eG7BoV1RfYH1aSpTQaKyc3k6e1vpWa3BcSFBc%t3e#06LBjBU%m3zKn1vAWcBzXZ7rnRcyVXIEJwp%NaBhW#0BmrNcSeGp90xetPy8vrPk8GxKBJ0Iv9o&5%wL90YlXeLS89LZkS EiCF15lH0Em0aNEl8g84ZARHIscpBFzkGRJU');
  	expect(listElements.count()).toBe(1);
  	expect(firstLabel.getText()).toEqual('JNA7aL0acuGQq8voG##JR2%2EkvVwuJxY#JiFAYP H#ItYhsmK45k7LJKEMq6tkHpgpA9jYx 1QWXyeMsM87eG7BoV1RfYH1aSpTQaKyc3k6e1vpWa3BcSFBc%t3e#06LBjBU%m3zKn1vAWcBzXZ7rnRcyVXIEJwp%NaBhW#0BmrNcSeGp90xetPy8vrPk8GxKBJ0Iv9o&5%wL90YlXeLS89LZkS EiCF15lH0Em0aNEl8g84ZARHIscpBFzkGRJU');
  	deleteTodo(firstLabel, firstDelete);
  });

  it('should create new todo', function() {
    createTodo("Make some noise!");

    expect(listElements.count()).toBe(1);
    expect(listElements.first().getText()).toEqual('Make some noise!');
  });
  
 
  it('should edit todo', function() {
    browser.actions().doubleClick(firstLabel).perform();
	
	firstInput.clear();
	firstInput.sendKeys('Make it happen!!!!');
	firstInput.sendKeys(protractor.Key.ENTER);

	expect(listElements.first().getText()).toEqual('Make it happen!!!!');
  }); 

  it('should mark done single todo', function() {
    listElements.first().element(by.model('todo.completed')).click();

    var checked = element.all(by.css('li.completed'));
	expect(checked.count()).toBe(1);
	expect(counter.getText()).toEqual('0');
	expect(counterText.getText()).toEqual('items left');
  });

  it('should delete single completed todo', function() {
    browser.actions().mouseMove(firstLabel).perform();
    firstDelete.click();
    
	expect(listElements.count()).toBe(0);	
  });

  it('should mark completed several todos', function() {
    createTodo("todo1");
    createTodo("todo2");
    createTodo("todo3");

    toggleAll.click();
    
    var checked = element.all(by.css('li.completed'));
	expect(checked.count()).toBe(3);
	expect(counter.getText()).toEqual('0');	
  });

  it('should clear all completed todos', function() {
  	browser.driver.executeScript("arguments[0].click();", clearCompleted.getWebElement());
  	expect(listElements.count()).toBe(0);	
  });

  it('should delete single active todo', function() {
    createTodo("New active todo");
	deleteTodo(firstLabel, firstDelete);
    
	expect(listElements.count()).toBe(0);
  });	

  it('should show correct counter for 1 todo', function() {
    createTodo("New active todo");
 	expect(counter.getText()).toEqual('1');
	expect(counterText.getText()).toEqual('item left');
	deleteTodo(firstLabel, firstDelete);
  });

  it('should show correct counter for 2 todos', function() {
    createTodo("New active todo");
    createTodo("New active todo2");
 	expect(counter.getText()).toEqual('2');
	expect(counterText.getText()).toEqual('items left');
	deleteTodo(firstLabel, firstDelete);
	deleteTodo(firstLabel, firstDelete);
  }); 

  it('should filter completed and active todos', function() {
  	createTodo("Newe active todo");
    createTodo("Newer active todo");
    listElements.first().element(by.model('todo.completed')).click();
    createTodo("Newest active todo");

    filterActive.click();
    expect(listElements.count()).toBe(2);
    filterCompleted.click()
    expect(listElements.count()).toBe(1);
    filterAll.click();
    expect(listElements.count()).toBe(3);
  }); 

});