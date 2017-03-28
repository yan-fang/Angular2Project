## What is card mapping and why do I need it?
Card Mapping is how we will support the core URL requirements (you can see this [Pulse page by Yes We Can](https://pulse.kdc.capitalone.com/docs/DOC-156835) for information on why need this)
as well as keeping track of the available states in Credit Card. Prior solution
only handled states that were a child of 'CreditCardDetails.transactions'. With the new lightweight entry to card not every feature falls into this.
You may have noticed typing in your URL while in ease would end you up on L2 instead of your feature (examples: /offers, /accountusers). This
was uncovered doing the email campaign link through.


### How does this affect me?
All current states have been refactored to use this new pattern. You can still call $state.go like you normally would. Only change is registering states.

### Ok I have to register a new state how do I do that?
Simple!
In your specific module, instead of injecting `$stateProvider` inject `cardMapProvider`
Then instead of registering state as
`$stateProvider.state(stateName)`
do
`cardMapProvider.createState(stateName)`

This behind the scenes runs this function
```
function createState(stateObj) {
      stateMap[stateObj.url] = stateObj.name;
      $stateProvider.state(stateObj);
    }
```
As you can see it registers the state with $stateProvider but also adds it to a map. This map will look like
`[url, stateName]`

So at anytime you can use the function in a controller (after injecting `cardMap`), the use case currently for this is the routing we have to do on L2,
you probably won't need to do this unless you are doing some kind of URL parsing.
```
 function getSpecificState(url) {
      return stateMap[url];
    }
```
`console.log(cardMap.getSpecificState('/Pay')); //'CreditCardDetails.transactions.payment'`
