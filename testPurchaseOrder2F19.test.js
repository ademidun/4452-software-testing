const assert = require('assert');
const {orderHandling} = require('./purchaseOrder2F19');

describe('PurchaseOrder', () => {

    class ClientAccount {
        constructor(age, balance, creditScore) {
            this.age = age;
            this.balance = balance;
            this.creditScore = creditScore;
        }


    }

    class Inventory {
        constructor(name, q) {
            this.name = name;
            this.q = q;
        }
    }

    describe('Decision Table Testing', function() {
        // Setup accounts for decision testing
        const d1 = new ClientAccount(55, 4500, 75); // excellent, good
        const d2 = new ClientAccount(20, 3500,  75); // good, good
        const d3 = new ClientAccount(25, 300, 85); // acceptable, good
        const d4 = new ClientAccount(17, 350, 75); // adverse, good
        new ClientAccount(0, -100, 95);  // invalid, good
        const d6 = new ClientAccount(35, 900, 40); // good, adverse
        const d7 = new ClientAccount(15, 500, 40); // acceptable, adverse
        const d8 = new ClientAccount(0, -100, -15); // invalid, invalid
        const d9 = new ClientAccount(75, 90, 55); //
        const d10 = new ClientAccount(75, 2500, 55); //
        new ClientAccount(7, 50, 30);  // adverse, adverse

        // Setup inventory for decision testing
        const inv1 = new Inventory('apple', 0);
        const inv2 = new Inventory('banana', 50);
        const inv3 = new Inventory('grape', 100);
        const invArray = [inv1, inv2, inv3];

        describe('orderHandling tests', function() {
            it('should equal accepted', function() {
                assert.equal(orderHandling(d1, 'apple', invArray, 500, 'default'), 'accepted');
            });

            it('should equal accepted, case 2', function() {
                assert.equal(orderHandling(d2, 'apple', invArray, 500, 'default'), 'accepted');
            });

            it('should equal accepted, case 3', function() {
                assert.equal(orderHandling(d4, 'banana', invArray, 50, 'default'), 'accepted');
            });

            it('should equal accepted, case 4', function() {
                assert.equal(orderHandling(d3, 'banana', invArray, 50, 'default'), 'accepted');
            });

            it('should equal accepted, case 5', function() {
                assert.equal(orderHandling(d9, 'banana', invArray, 50, 'restricted'), 'accepted');
            });

            it('should equal pending', function() {
                assert.equal(orderHandling(d3, 'banana', invArray, 500, 'default'), 'pending');
            });

            it('should equal pending, case 2', function() {
                assert.equal(orderHandling(d3, 'apple', invArray, 110, 'default'), 'pending');
            });

            it('should equal pending, case 3', function() {
                assert.equal(orderHandling(d4, 'banana', invArray, 500, 'default'), 'pending');
            });

            it('should equal underReview', function() {
                assert.equal(orderHandling(d6, 'apple', invArray, 500, 'default'), 'underReview');
            });

            it('should equal underReview, case 2', function() {
                assert.equal(orderHandling(d7, 'banana', invArray, 50, 'default'), 'underReview');
            });

            it('should equal rejected', function() {
                assert.equal(orderHandling(d8, 'apple', invArray, 500, 'default'), 'rejected');
            });

            it('should equal rejected, case 2', function() {
                assert.equal(orderHandling(d7, 'banana', invArray, 500, 'default'), 'rejected');
            });

            it('should equal rejected, case 3', function() {
                assert.equal(orderHandling(d7, 'apple', invArray, 500, 'default'), 'rejected');
            });

            it('should equal rejected, case 4', function() {
                assert.equal(orderHandling(d4, 'apple', invArray, 500, 'default'), 'rejected');
            });

            it('should equal rejected, case 5', function() {
                assert.equal(orderHandling(d4, 'apple', invArray, 500, 'default'), 'rejected');
            });

            it('should equal invalid, case 1', function() {
                assert.equal(orderHandling(d10, 'orange', invArray, 50, 'default'), 'rejected');
            });
        })
    })
});